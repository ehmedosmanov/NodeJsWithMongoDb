import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Products = mongoose.model("products", productSchema);
const Categories = mongoose.model("categories", categorySchema);

app.get("/categories", async (req, res) => {
  try {
    const category = await Categories.find({});
    res.send(category);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/categories/:id", async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ message: `Not Found Category By Id ${req.params.id}` });
    res.send(category);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/categories", async (req, res) => {
  try {
    const category = new Categories({
      ...req.body,
    });
    category.save();
    res.send(category);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.put("/categories/:id", async (req, res) => {
  try {
    const category = await Categories.findByIdAndUpdate(req.params.id);
    if (category) {
      category.name = req.body.name;
      category.description = req.body.description;
      category.save();
      res.send(category);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.delete('/categories/:id', async (req,res) => {
  try {
    const category = await Categories.findByIdAndDelete(req.params.id)
    if(!category) {
        res.status(404).json({ message: "Not Found" });
    }
    res.send(category)
  } catch (error) {
    res.status(500).json({ message: error });
    
  }
})
//Products

app.get("/products", async (req, res) => {
  try {
    const product = await Products.find({});
    res.send(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not Found" });
    res.send(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = new Products({
      ...req.body,
    });
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not Found" });
    product.name = req.body.name;
    product.price = req.body.price;
    product.img = req.body.img;
    product.save();
    res.send(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Not Found" });
    }
    res.send(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// app.get("/products", async (req, res) => {
//   try {
//     const product = await Products.find({});
//     res.send(product);
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

// app.get("/products/:id", async (req, res) => {
//   try {
//     const product = await Products.findById(req.params.id);
//     if (!product) {
//       res.status(404).json({ message: "not found" });
//     }
//     res.send(product);
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

// app.post("/products", (req, res) => {
//   try {
//     const product = new Products({
//       ...req.body,
//     });

//     product.save();
//     res.send({ message: "Product Created" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.delete("/products/:id", async (req, res) => {
//   try {
//     const product = await Products.findByIdAndDelete(req.params.id);
//     if (!product) {
//       res.status(404).json({ message: "Not Found" });
//     }
//     res.status(200).json({ message: "Product Deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

// app.put("/products/:id", async (req, res) => {
//   try {
//     let product = await Products.findByIdAndUpdate(req.params.id);
//     if (product) {
//       product.name = req.body.name;
//       product.price = req.body.price;
//       product.img = req.body.img;
//       await product.save();
//       res.json(product);
//     }
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

const PORT = process.env.PORT;
const url = process.env.CONNECTION_URL.replace(
  "<password>",
  process.env.PASSWORD
);

mongoose.connect(url).catch((err) => console.log(`Db not connect ${err}`));

app.listen(PORT, () => {
  console.log("Server is running");
});
