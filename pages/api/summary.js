import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || user.isAdmin === true)
    return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary
    const users = readUsersDB();
    const customers = users.filter(x => !x.isAdmin);
    const admins = users.filter(x => x.isAdmin);
    const totalAmount = customers.reduce((n, o) => {
    return n + (o.money != null ? o.money : 0);}, 0);
    //return response
    return res.status(200).json({ok: true,userTotal: customers.length,adminTotal: admins.length,
       totalMoney: totalAmount != null ? totalAmount : 0,
    })
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}