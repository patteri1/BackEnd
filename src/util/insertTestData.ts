import { Location } from '../model/Location';
import { PalletType } from '../model/PalletType';
import { Storage } from '../model/Storage';
import { Order } from '../model/Order';
import { OrderRow } from '../model/OrderRow';

export const insertTestData = async () => {
    try {
        const [location1, location2] = await Promise.all([
            Location.create({
                name: 'Kuljetusliike 1',
                address: 'Address 1',
                postalCode: '12345',
                city: 'City 1',
                price: 10.5,
            }),
            Location.create({
                name: 'Kuljetusliike 2',
                address: 'Address 2',
                postalCode: '67890',
                city: 'City 2',
                price: 15.0,
            }),
            Location.create({
                name: 'Käsittelylaitos 1',
                address: 'Address 3',
                postalCode: '67666',
                city: 'City 3',
                price: 0,
            }),
        ]);

        const [palletType1, palletType2] = await Promise.all([
            PalletType.create({
                product: 'Paristolaatikko',
                amount: 30,
            }),
            PalletType.create({
                product: 'Litiumlaatikko',
                amount: 5,
            }),
        ]);

        const [order1, order2] = await Promise.all([
            Order.create({
                locationId: location1.id,
            }),
            Order.create({
                locationId: location2.id,
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
            Storage.create({
                locationId: location1.id,
                palletTypeId: palletType1.palletTypeId,
                amount: 20,
            }),
            Storage.create({
                locationId: location2.id,
                palletTypeId: palletType2.palletTypeId,
                amount: 35,
            }),
        ]);

        console.log('Test data inserted successfully!');
    } catch (error) {
        console.error('Error inserting test data:', error);
    }
};
