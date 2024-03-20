import { Location } from '../model/Location'
import { PalletType } from '../model/PalletType'
import { Storage } from '../model/Storage'
import { Order } from '../model/Order'
import { OrderRow } from '../model/OrderRow'
import { LocationPrice } from '../model'

export const insertTestData = async () => {
    try {
      const [palletType1, palletType2, palletType3] = await Promise.all([
        PalletType.create({
          product: "Paristolaatikko",
          amount: 30,
        }),
        PalletType.create({
          product: "Litiumlaatikko",
          amount: 5,
        }),
        PalletType.create({
          product: "Pahvilaatikko",
          amount: 100,
        }),
      ]);

      const [location1, location2, location3] = await Promise.all([
        Location.create({
          name: "Kuljetus Korhonen",
          address: "Address 1",
          postCode: "01600",
          city: "Vantaa",
          locationType: "Kuljetusliike",
        }),
        Location.create({
          name: "Lahtisen Logistiikka",
          address: "Address 2",
          postCode: "33340",
          city: "Tampere",
          locationType: "Kuljetusliike",
        }),
        Location.create({
          name: "Lähettipalvelu Lehtonen",
          address: "Address 2",
          postCode: "33340",
          city: "Tampere",
          locationType: "Kuljetusliike",
        }),
        Location.create({
          name: "Akkukäsittely",
          address: "Address 3",
          postCode: "85500",
          city: "Nivala",
          locationType: "Käsittelylaitos",
        }),
      ]);


      // Add locationPrice and storages for each product to each location, all prices and amounts 0
      const palletTypes = await PalletType.findAll();
      const locations = [location1, location2, location3];

      for (const location of locations) {
        await LocationPrice.create({
          locationId: location.locationId,
          price: 0,
          validFrom: '2023-01-01',
        });

        for (const palletType of palletTypes) {
          await Storage.create({
            locationId: location.locationId,
            palletTypeId: palletType.palletTypeId,
            amount: 0,
            createdAt: '2023-01-01',
          });
        }
      }

      await Promise.all([
        LocationPrice.create({
          locationId: location1.locationId,
          price: 50.95,
          validFrom: "2024-01-01",
        }),
        LocationPrice.create({
          locationId: location1.locationId,
          price: 80.00,
          validFrom: "2024-01-15",
        }),
        LocationPrice.create({
          locationId: location1.locationId,
          price: 67.4,
          validFrom: "2024-01-20",
        }),
        LocationPrice.create({
          locationId: location1.locationId,
          price: 30.4,
          validFrom: "2024-01-25",
        }),
        LocationPrice.create({
          locationId: location1.locationId,
          price: 30.4,
          validFrom: "2024-01-31",
        }),
        LocationPrice.create({
          locationId: location2.locationId,
          price: 89.75,
          validFrom: "2024-01-01",
        }),
        LocationPrice.create({
          locationId: location3.locationId,
          price: 120.2,
          validFrom: "2024-01-01",
        }),
      ]);

      const [order1, order2, order3, order4, order5] = await Promise.all([
        Order.create({
          locationId: location1.locationId,
          datetime: "13.02.2024",
          status: "Avattu",
        }),
        Order.create({
          locationId: location2.locationId,
          datetime: "05.02.2024",
          status: "Avattu",
        }),
        Order.create({
          locationId: location2.locationId,
          datetime: "16.01.2024",
          status: "Noudettu",
        }),
        Order.create({
          locationId: location1.locationId,
          datetime: "22.12.2023",
          status: "Peruttu",
        }),
        Order.create({
          locationId: location1.locationId,
          datetime: "11.12.2023",
          status: "Noudettu",
        }),
      ]);

      await Promise.all([
        OrderRow.create({
          orderId: order1.orderId,
          palletTypeId: palletType1.palletTypeId,
          amount: 8,
        }),
        OrderRow.create({
          orderId: order1.orderId,
          palletTypeId: palletType2.palletTypeId,
          amount: 4,
        }),
        OrderRow.create({
          orderId: order2.orderId,
          palletTypeId: palletType1.palletTypeId,
          amount: 10,
        }),
        OrderRow.create({
          orderId: order2.orderId,
          palletTypeId: palletType2.palletTypeId,
          amount: 5,
        }),
        OrderRow.create({
          orderId: order3.orderId,
          palletTypeId: palletType1.palletTypeId,
          amount: 6,
        }),
        OrderRow.create({
          orderId: order4.orderId,
          palletTypeId: palletType2.palletTypeId,
          amount: 40,
        }),
        OrderRow.create({
          orderId: order5.orderId,
          palletTypeId: palletType1.palletTypeId,
          amount: 10,
        }),
        OrderRow.create({
          orderId: order5.orderId,
          palletTypeId: palletType2.palletTypeId,
          amount: 3,
        }),
      ]);

      await Promise.all([
        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType1.palletTypeId,
          amount: 20,
          createdAt: "2023-12-28 16:33:39.175+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType1.palletTypeId,
          amount: 60,
          createdAt: "2024-01-01 14:55:42.100+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType1.palletTypeId,
          amount: 70,
          createdAt: "2024-01-24 20:01:55.162+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType1.palletTypeId,
          amount: 50,
          createdAt: "2024-02-01 09:06:20.162+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType2.palletTypeId,
          amount: 2,
          createdAt: "2023-12-28 16:33:39.175+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType2.palletTypeId,
          amount: 3,
          createdAt: "2024-01-01 14:55:42.100+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType2.palletTypeId,
          amount: 0,
          createdAt: "2024-01-24 20:01:55.162+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType2.palletTypeId,
          amount: 1,
          createdAt: "2024-02-01 09:06:20.162+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType3.palletTypeId,
          amount: 2,
          createdAt: "2023-12-30 16:33:39.175+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType3.palletTypeId,
          amount: 6,
          createdAt: "2024-01-03 14:55:42.100+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType3.palletTypeId,
          amount: 1,
          createdAt: "2024-01-15 20:01:55.162+00",
        }),

        Storage.create({
          locationId: location1.locationId,
          palletTypeId: palletType3.palletTypeId,
          amount: 2,
          updatedAt: new Date("2024-01-31 09:06:20.162+00"),
          createdAt: "2024-01-31 09:06:20.162+00",
        }),

        Storage.create({
          locationId: location2.locationId,
          palletTypeId: palletType2.palletTypeId,
          amount: 3,
          createdAt: "2023-12-28 16:33:39.175+00",
        }),

        Storage.create({
          locationId: location3.locationId,
          palletTypeId: palletType3.palletTypeId,
          amount: 1,
        }),
      ]);

      console.log("Test data inserted successfully!");
    } catch (error) {
        console.error('Error inserting test data:', error);
    }
};
