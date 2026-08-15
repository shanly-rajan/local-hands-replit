import { Router, type IRouter } from "express";
import { db, adsTable } from "@workspace/db";
import { ListAdsQueryParams, ListAdsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/ads", async (req, res): Promise<void> => {
  const parsed = ListAdsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  let ads = (await db.select().from(adsTable)).filter((a) => a.active);
  if (parsed.data.countryId != null) {
    ads = ads.filter((a) => a.countryId === parsed.data.countryId);
  }
  res.json(ListAdsResponse.parse(ads));
});

export default router;
