
// get valid storages for date range, createdAt acts as valid from
export const validStoragesForDateRange: string = `
          	    -- Storages that are valid on start date
                  WITH ranked_storages AS (
                    SELECT "s"."storageId", "s"."palletAmount", "s"."createdAt", "s"."locationId", "s"."productId",
                           ROW_NUMBER() OVER(PARTITION BY "s"."locationId", "s"."productId" ORDER BY "s"."createdAt" DESC) as rn
                    FROM "storage" "s"
                    WHERE ("s"."locationId", "s"."productId", "s"."createdAt") IN (
                        SELECT "s2"."locationId", "s2"."productId", MAX("s2"."createdAt")
                        FROM "storage" "s2"
                        WHERE "s2"."createdAt" <= :startDate
                        AND "s2"."locationId" IN (:locationIds)
                        GROUP BY "s2"."locationId", "s2"."productId"
                    )
                )
                SELECT "storageId", "palletAmount", "createdAt", "locationId", "productId"
                FROM ranked_storages
                WHERE rn = 1

                UNION

                        -- Storage changes within the date range
                        SELECT "s"."storageId", "s"."palletAmount", "s"."createdAt", "s"."locationId", "s"."productId"
                        FROM "storage" "s"
                        WHERE "s"."createdAt" >= :startDate
                        AND "s"."createdAt" < :endDate
                        AND "s"."locationId" IN (:locationIds);
	`

// get valid prices for the date range
export const validLocationPricesForDateRange: string = ` 
         -- Prices that are valid on start date
         SELECT "lp"."locationPriceId", "lp"."price", "lp"."validFrom", "lp"."locationId"
         FROM "locationPrice" "lp"
         WHERE "lp"."validFrom" = (
             SELECT MAX("lp2"."validFrom")
             FROM "locationPrice" "lp2"
             WHERE "lp2"."validFrom" <= :startDate
             AND "lp2"."locationId" = "lp"."locationId"
         )
         AND "lp"."locationId" IN (:locationIds)
         
         UNION
         
         -- Price changes within the date range
         SELECT "lp"."locationPriceId", "lp"."price", "lp"."validFrom", "lp"."locationId"
         FROM "locationPrice" "lp"
         WHERE "lp"."validFrom" >= :startDate
         AND "lp"."validFrom" <= :endDate --Price can change only at start of day time 00:00:00
         AND "lp"."locationId" IN (:locationIds)

         ORDER BY "validFrom" ASC;
    `