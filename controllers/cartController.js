import Cart from "../models/cartModel.js";

// Add item to cart (requires user in req.user)
export const addToCartController = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).send({ success: false, message: "Unauthorized" });

    const { productId, name, price, quantity = 1 } = req.body;
    if (!productId) return res.status(400).send({ success: false, message: "productId is required" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // check if item exists
    const idx = cart.items.findIndex((i) => i.productId === productId);
    if (idx > -1) {
      // update quantity
      cart.items[idx].quantity = cart.items[idx].quantity + quantity;
    } else {
      cart.items.push({ productId, name, price, quantity });
    }

    await cart.save();
    res.status(200).send({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error adding to cart", error });
  }
};

export const getCartController = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).send({ success: false, message: "Unauthorized" });

    const cart = await Cart.findOne({ user: userId });
    res.status(200).send({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error fetching cart", error });
  }
};
