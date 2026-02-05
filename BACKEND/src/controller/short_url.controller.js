import { getShortUrl } from "../dao/short_url.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from "../services/short_url.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

// CREATE SHORT URL
export const createShortUrl = wrapAsync(async (req, res) => {
  const data = req.body;
  let shortUrl;

  if (req.user) {
    shortUrl = await createShortUrlWithUser(
      data.url,
      req.user._id,
      data.slug
    );
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url);
  }

  res.status(200).json({
    shortUrl: `${process.env.APP_URL}/${shortUrl}`,
  });
});

// REDIRECT FROM SHORT URL
export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const url = await getShortUrl(id);

  if (!url) {
    return res.status(404).json({ message: "Short URL not found" });
  }

  return res.redirect(url.full_url);
});

// CREATE CUSTOM SHORT URL
export const createCustomShortUrl = wrapAsync(async (req, res) => {
  const { url, slug } = req.body;

  const shortUrl = await createShortUrlWithoutUser(url, slug);

  res.status(200).json({
    shortUrl: `${process.env.APP_URL}/${shortUrl}`,
  });
});
