const { UAParser } = require("ua-parser-js");
const Link = require("../models/Link");
const Click = require("../models/Click");
const { cacheGet, cacheSet, cacheDel } = require("../db/redis");

const resolveCountry = async (ip) => {
  try {
    const response = await fetch(`https://ip-api.com/json/${ip}`);
    const data = await response.json();
    return data.country || "Unknown";
  } catch {
    return "Unknown";
  }
};

const resolveDeviceType = (uaString) => {
  const parser = new UAParser(uaString);
  const deviceType = parser.getDevice().type;
  if (deviceType === "mobile") return "Mobile";
  if (deviceType === "tablet") return "Tablet";
  return "Desktop";
};

const redirectByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const cachedUrl = await cacheGet(code);

    let link;
    let targetUrl = cachedUrl;
    if (!cachedUrl) {
      link = await Link.findOne({ code });
      if (!link) {
        return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/not-found`);
      }

      if (link.expiresAt && link.expiresAt.getTime() < Date.now()) {
        await cacheDel(code);
        return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/not-found`);
      }

      targetUrl = link.originalUrl;
      const ttl = link.expiresAt
        ? Math.max(1, Math.floor((link.expiresAt.getTime() - Date.now()) / 1000))
        : 604800;
      await cacheSet(code, targetUrl, ttl);
    } else {
      link = await Link.findOne({ code });
    }

    if (link) {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "127.0.0.1";
      const [country, deviceType] = await Promise.all([
        resolveCountry(ip.replace("::ffff:", "")),
        Promise.resolve(resolveDeviceType(req.headers["user-agent"] || ""))
      ]);
      await Click.create({ linkId: link._id, country, deviceType });
    }

    return res.redirect(302, targetUrl);
  } catch (err) {
    return next(err);
  }
};

module.exports = { redirectByCode };
