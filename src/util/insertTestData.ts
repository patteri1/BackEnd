import { Location } from '../model/Location';
import { PalletType } from '../model/PalletType';
import { Storage } from '../model/Storage';
import { Order } from '../model/Order';
import { OrderRow } from '../model/OrderRow';
import { PostalCode } from '../model/PostalCode'

export const insertTestData = async () => {
    try {
        const [postalCode1, postalCode2, postalCode3] = await Promise.all([
            PostalCode.create({
                postalCode: '12345',
                city: 'City 1',
            }),
            PostalCode.create({
                postalCode: '67890',
                city: 'City 2'
            }),
            PostalCode.create({
                postalCode: '67666',
                city: 'City 3'
            })
        ])

        const [location1, location2] = await Promise.all([
            Location.create({
                name: 'Kuljetusliike 1',
                address: 'Address 1',
                postCode: postalCode1.postalCode,
                price: 10.5,
            }),
            Location.create({
                name: 'Kuljetusliike 2',
                address: 'Address 2',
                postCode: postalCode2.postalCode,
                price: 15.0,
            }),
            Location.create({
                name: 'Käsittelylaitos 1',
                address: 'Address 3',
                postCode: postalCode3.postalCode,
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

        const [order1, order2, order3, order4, order5] = await Promise.all([
            Order.create({
                locationId: location1.id,
                datetime: '13.02.2024',
                status: 'Avattu'
            }),
            Order.create({
                locationId: location2.id,
                datetime: '05.02.2024',
                status: 'Avattu'
            }),
            Order.create({
                locationId: location2.id,
                datetime: '16.01.2024',
                status: 'Noudettu'
            }),
            Order.create({
                locationId: location1.id,
                datetime: '22.12.2023',
                status: 'Peruttu'
            }),
            Order.create({
                locationId: location1.id,
                datetime: '11.12.2023',
                status: 'Noudettu'
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
