const { customAlphabet } = require("nanoid");
const Link = require("../models/Link");
const Click = require("../models/Click");
const { cacheSet, cacheDel } = require("../db/redis");

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const isValidHttpUrl = (raw) => {
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const getTtlSeconds = (expiresAt) => {
  if (expiresAt) {
    return Math.max(1, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  }
  return 604800;
};

const shorten = async (req, res, next) => {
  try {
    const { url, alias, expiresAt } = req.body;
    if (!url || !isValidHttpUrl(url)) {
      return res.status(400).json({ error: "Valid URL is required" });
    }

    if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
      return res.status(400).json({ error: "Expiry must be in the future" });
    }

    let code = alias || nanoid();
    let existing = await Link.findOne({ $or: [{ code }, { alias: alias || null }] });
    while (!alias && existing) {
      code = nanoid();
      existing = await Link.findOne({ code });
    }

    if (alias && existing) {
      return res.status(409).json({ error: "Alias already taken" });
    }

    const link = await Link.create({
      userId: req.user?.id,
      code,
      alias: alias || undefined,
      originalUrl: url,
      expiresAt: expiresAt || undefined
    });

    await cacheSet(link.code, link.originalUrl, getTtlSeconds(link.expiresAt));
    const shortUrl = `${process.env.BASE_URL}/${link.code}`;
    return res.status(201).json({ code: link.code, shortUrl, link });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Code or alias already exists" });
    }
    return next(err);
  }
};

const listUserLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const linkIds = links.map((l) => l._id);
    const clickCounts = await Click.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      { $group: { _id: "$linkId", count: { $sum: 1 } } }
    ]);

    const clickMap = new Map(clickCounts.map((item) => [item._id.toString(), item.count]));
    const enriched = links.map((link) => ({
      ...link.toObject(),
      clicks: clickMap.get(link._id.toString()) || 0
    }));

    return res.json(enriched);
  } catch (err) {
    return next(err);
  }
};

const deleteLink = async (req, res, next) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: "Link not found" });
    if (link.userId?.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await Promise.all([
      Link.deleteOne({ _id: link._id }),
      Click.deleteMany({ linkId: link._id }),
      cacheDel(link.code)
    ]);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

const updateLink = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { alias, expiresAt } = req.body;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: "Link not found" });
    if (link.userId?.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (alias) {
      const aliasUsed = await Link.findOne({ alias, _id: { $ne: link._id } });
      if (aliasUsed) {
        return res.status(409).json({ error: "Alias already taken" });
      }
      link.alias = alias;
    }

    if (expiresAt !== undefined) {
      if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
        return res.status(400).json({ error: "Expiry must be in the future" });
      }
      link.expiresAt = expiresAt || undefined;
    }

    await link.save();
    await cacheSet(link.code, link.originalUrl, getTtlSeconds(link.expiresAt));
    return res.json(link);
  } catch (err) {
    return next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: "Link not found" });
    if (link.userId?.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const [totalClicks, clicksPerDay, topCountries, deviceBreakdown] = await Promise.all([
      Click.countDocuments({ linkId: link._id }),
      Click.aggregate([
        { $match: { linkId: link._id, clickedAt: { $gte: start } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Click.aggregate([
        { $match: { linkId: link._id, country: { $ne: null } } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Click.aggregate([
        { $match: { linkId: link._id } },
        { $group: { _id: "$deviceType", count: { $sum: 1 } } }
      ])
    ]);

    return res.json({
      code: link.code,
      totalClicks,
      clicksPerDay,
      topCountries,
      deviceBreakdown
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { shorten, listUserLinks, deleteLink, updateLink, getStats };
