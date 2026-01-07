import { CollectionConfig } from "payload";


export const Bookings : CollectionConfig = {
    slug: "bookings",
    fields: [
        {
            name: "buyer",
            type: "relationship",
            relationTo: "users",
        },
        {
            name: "property",
            type: "relationship",
            relationTo: "properties"
        }
    ],
}