import { Location } from '../model/Location';
import { PalletType } from '../model/PalletType';
import { Storage } from '../model/Storage';

export const insertTestData = async () => {
    try {
        const [location1, location2] = await Promise.all([
            Location.create({
                name: 'Location 1',
                address: 'Address 1',
                postalCode: '12345',
                city: 'City 1',
                price: 10.5,
            }),
            Location.create({
                name: 'Location 2',
                address: 'Address 2',
                postalCode: '67890',
                city: 'City 2',
                price: 15.0,
            }),
        ]);

        const [palletType1, palletType2] = await Promise.all([
            PalletType.create({
                product: 'Product 1',
                amount: 100,
            }),
            PalletType.create({
                product: 'Product 2',
                amount: 150,
            }),
        ]);

        await Promise.all([
            Storage.create({
                locationId: location1.id,
                palletTypeId: palletType1.palletTypeId,
                amount: 50,
            }),
            Storage.create({
                locationId: location2.id,
                palletTypeId: palletType2.palletTypeId,
                amount: 75,
            }),
        ]);

        console.log('Test data inserted successfully!');

    } catch (error) {
        console.error('Error inserting test data:', error);
    }
};