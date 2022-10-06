import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    if (!user || user.isAdmin === true)
      return res.status(403).json({ ok: false, message: "You do not have permission to withdraw" });

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    if (amount <= 0)
      return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });

    //find and update money in DB (if user has enough money)
    const users = readUsersDB();
    const userAmount = users.find(x => {
      return user.username === x.username
    })
    if (userAmount.money < amount)
      return res.status(400).json({ ok: false, message: "You do not has enough money" });
    userAmount.money -= amount;
    writeUsersDB(users);

    //return response
    return res.status(200).json({ok: true,money: userAmount.money != null ? userAmount.money : 0,})
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}