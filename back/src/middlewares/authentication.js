import jwt from 'jsonwebtoken';

export const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader){
            return res.status(401).send("Unauthorized");
        }

        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, user) => {
                if (err) return res.status(403).json({ message: "Verification failed" });
                req.user = user.id;
                next();
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Token invalid or expired" });
    }
}