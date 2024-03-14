import { Location } from '../model/Location'
import { PalletType } from '../model/PalletType'
import { Storage } from '../model/Storage'
import { Order } from '../model/Order'
import { OrderRow } from '../model/OrderRow'
import { LocationPrice } from '../model'

export const insertTestData = async () => {
    try {
        
        const [location1, location2, location3] = await Promise.all([
            Location.create({
                name: 'Kuljetus Korhonen',
                address: 'Pihatie 7',
                postCode: '01600',
                city: 'Vantaa',
                locationType: 'Kuljetusliike'
            }),

            Location.create({
                name: 'Jorin kuljetus Oy',
                address: 'Mäkipolku 3',
                postCode: '33340',
                city: 'Tampere',
                locationType: 'Kuljetusliike'
            }),
            Location.create({
                name: 'Käsittelylaitos',
                address: 'Käsittelytie 4',
                postCode: '85500',
                city: 'Nivala',
                locationType: 'Käsittelylaitos'
            }),
        ])

        await Promise.all([
            LocationPrice.create({
                locationId: location1.locationId,
                price: 50.95,
                validFrom: '2024-01-01',
            }),
            LocationPrice.create({
                locationId: location1.locationId,
                price: 50.40,
                validFrom: '2024-01-15',
            }),
            LocationPrice.create({
                locationId: location1.locationId,
                price: 67.40,
                validFrom: '2024-01-20',
            }),
            LocationPrice.create({
                locationId: location1.locationId,
                price: 30.40,
                validFrom: '2024-01-25',
            }),
            LocationPrice.create({
                locationId: location1.locationId,
                price: 30.40,
                validFrom: '2024-01-31',
            }),
            LocationPrice.create({
                locationId: location2.locationId,
                price: 89.75,
                validFrom: '2024-01-01',
            }),
            LocationPrice.create({
                locationId: location3.locationId,
                price: 120.20,
                validFrom: '2024-01-01',
            }),
        ])

        const [palletType1, palletType2, palletType3] = await Promise.all([
            PalletType.create({
                productName: 'Paristolaatikko',
                productAmount: 30,
            }),
            PalletType.create({
                productName: 'Litiumlaatikko',
                productAmount: 5,
            }),
            PalletType.create({
                productName: 'Pahvilaatikko',
                productAmount: 100,
            }),
        ])

        const [order1, order2, order3, order4, order5] = await Promise.all([
            Order.create({
                locationId: location1.locationId,
                createdAt: '2024-02-13 13:22:01.034+00',
                status: 'Avattu'
            }),
            Order.create({
                locationId: location2.locationId,
                createdAt: '2024-02-05 08:02:33.102+00',
                status: 'Avattu'
            }),
            Order.create({
                locationId: location2.locationId,
                createdAt: '2024-01-16 11:02:00.000+00',
                status: 'Noudettu'
            }),
            Order.create({
                locationId: location1.locationId,
                createdAt: '2023-12-22 17:12:09.011+00',
                status: 'Peruttu'
            }),
            Order.create({
                locationId: location1.locationId,
                createdAt: '2023-12-11 12:22:22.122+00',
                status: 'Noudettu'
            }),
        ])

        await Promise.all([
            OrderRow.create({
                orderId: order1.orderId,
                palletTypeId: palletType1.palletTypeId,
                palletAmount: 8,
            }),
            OrderRow.create({
                orderId: order1.orderId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 4,
            }),
            OrderRow.create({
                orderId: order2.orderId,
                palletTypeId: palletType1.palletTypeId,
                palletAmount: 10,
            }),
            OrderRow.create({
                orderId: order2.orderId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 5,
            }),
            OrderRow.create({
                orderId: order3.orderId,
                palletTypeId: palletType1.palletTypeId,
                palletAmount: 6,
            }),
            OrderRow.create({
                orderId: order4.orderId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 40,
            }),
            OrderRow.create({
                orderId: order5.orderId,
                palletTypeId: palletType1.palletTypeId,
                palletAmount: 10,
            }),
            OrderRow.create({
                orderId: order5.orderId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 3,
            }),
        ])

        await Promise.all([
            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType1.palletTypeId,
                palletAmount: 20,
                createdAt: '2023-12-28 16:33:39.175+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType1.palletTypeId,
                palletAmount: 60,
                createdAt: '2024-01-01 14:55:42.100+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType1.palletTypeId,
                palletAmount: 70,
                createdAt: '2024-01-24 20:01:55.162+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType1.palletTypeId,
                palletAmount: 50,
                createdAt: '2024-02-01 09:06:20.162+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 2,
                createdAt: '2023-12-28 16:33:39.175+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 3,
                createdAt: '2024-01-01 14:55:42.100+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 0,
                createdAt: '2024-01-24 20:01:55.162+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 1,
                createdAt: '2024-02-01 09:06:20.162+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType3.palletTypeId,
                palletAmount: 2,
                createdAt: '2023-12-30 16:33:39.175+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType3.palletTypeId,
                palletAmount: 6,
                createdAt: '2024-01-03 14:55:42.100+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType3.palletTypeId,
                palletAmount: 1,
                createdAt: '2024-01-15 20:01:55.162+00'
            }),

            Storage.create({
                locationId: location1.locationId,
                palletTypeId: palletType3.palletTypeId,
                palletAmount: 2,
                createdAt: '2024-01-31 09:06:20.162+00'
            }),

            Storage.create({
                locationId: location2.locationId,
                palletTypeId: palletType2.palletTypeId,
                palletAmount: 3,
                createdAt: '2023-12-28 16:33:39.175+00'
            }),

            Storage.create({
                locationId: location3.locationId,
                palletTypeId: palletType3.palletTypeId,
                palletAmount: 1,
                createdAt: '2023-12-28 16:33:39.175+00'

            }),
        ])

        console.log('Test data inserted successfully!');
    } catch (error) {
        console.error('Error inserting test data:', error);
    }
};
