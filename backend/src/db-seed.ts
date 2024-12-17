import User from "./postgres-models/user";
import ProductModel from "./mongo-models/product";
// import mock from '../../mock/products'
import mongoose from "mongoose";
import mockProducts from "./mockProducts.json";

const ObjectId = mongoose.Types.ObjectId;
const mock: any[] = [...mockProducts];

export default async function seed(): Promise<void> {
    try {
        console.log("I am seed");
        // default root account
        await User.findOrCreate({
            where: {
                userId: "GoogleLLC1998",
            },
            defaults: {
                userPassword: "GoogleLLC1998@supplier",
                userEmail: "Google.LLC@noreply.gmail.com",
                userFamilyName: "Alphabet",
                userGivenName: "Google",
                userPermission: "supplier",
                userProfilePictureUrl:
                    "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png",
            },
        });
        await User.findOrCreate({
            where: {
                userId: "MicrosoftCop1975",
            },
            defaults: {
                userPassword: "MicrosoftCop1975@supplier",
                userEmail: "Microsoft.Cop@noreply.gmail.com",
                userFamilyName: "Microsoft",
                userGivenName: "Corporation",
                userPermission: "supplier",
                userProfilePictureUrl:
                    "https://pngimg.com/uploads/microsoft/microsoft_PNG5.png",
            },
        });
        await User.findOrCreate({
            where: {
                userId: "root",
            },
            defaults: {
                userPassword: "1qazXSW@",
                userEmail: "nephew.UncleRoger@noreply.gmail.com",
                userFamilyName: "Uncle",
                userGivenName: "Roger",
                userPermission: "admin",
                userProfilePictureUrl:
                    "https://yt3.googleusercontent.com/eLCADxKBRj3JGsifnxitZwfsbeV3DDlS3r8SzN5QPT2juw0fTV34T09vIZWfEF3D4JmV2z6hZA=s900-c-k-c0x00ffffff-no-rj",
            },
        });
        // Function to convert string IDs to ObjectId recursively
        const convertIds: (obj: any) => any = (obj: any): any => {
            if (Array.isArray(obj)) {
                return obj.map(convertIds);
            } else if (obj && typeof obj === "object") {
                const newObj: any = {};
                for (const key in obj) {
                    if (key === "_id" && typeof obj[key] === "string") {
                        newObj[key] = new ObjectId(obj[key]);
                    } else {
                        newObj[key] = convertIds(obj[key]);
                    }
                }
                return newObj;
            }
            return obj;
        };

        // Convert all IDs in mock data
        const convertedMock: any = convertIds(mock);
        let i: number = 1;
        // Iterate over each product and insert if it doesn't exist
        for (const product of convertedMock) {
            const existingProduct: any = await ProductModel.findById(
                product._id,
            );
            if (!existingProduct) {
                // Assign the index to each merchandise.
                product.id = i;
                await ProductModel.create(product);
                i++;
                console.log(`Created product with ID ${product._id}`);
            } else {
                console.log(`Product with ID ${product._id} already exists.`);
            }
        }

        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Error during seeding:", error);
    }
}
