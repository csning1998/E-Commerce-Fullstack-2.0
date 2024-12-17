import mongoose, { Schema, Document } from "mongoose";

interface IOptionValue {
    value: number | string;
    priceAdj: number;
    _id?: string;
}

interface IProductOptions {
    name: string;
    values: IOptionValue[];
    _id?: string;
}

interface IProduct extends Document {
    _id: string;
    id: number;
    supplierID: number | string;
    brand: string;
    link2Pic: string;
    basePrice: number;
    discountPrice: number;
    collectionName: string;
    title: string;
    options: IProductOptions[];
}
// https://mongoosejs.com/docs/schematypes.html#:~:text=Buffer%22%2C%22data%22%3A%5B1%2C2%2C3%5D%7D-,Mixed,-An%20%22anything%20goes
const productSchema: Schema = new Schema<IProduct>({
    id: { type: Number },
    supplierID: { type: Schema.Types.Mixed },
    brand: { type: String },
    link2Pic: { type: String },
    basePrice: { type: Number },
    discountPrice: { type: Number },
    collectionName: { type: String },
    title: { type: String },
    // options: [],
    options: [
        {
            name: { type: String },
            values: [
                {
                    value: { type: Schema.Types.Mixed },
                    priceAdj: { type: Number },
                },
            ],
            _id: { type: String },
        },
    ],
});

// https://mongoosejs.com/docs/tutorials/virtuals.html#:~:text=In%20Mongoose%2C%20a%20virtual%20is%20a%20property%20that,domain%20portion%20of%20%27%20test%40gmail.com%20%27%20is%20%27gmail.com%27.

// productSchema.virtual('id').get(function() {
//     // //@ts-ignore
//     // var _this: IProduct = this;
//     // return parseInt(_this._id[_this._id.length - 1]);
//     return Math.random() * 10000
// });

const ProductModel: any = mongoose.model("Product", productSchema);

export default ProductModel;
