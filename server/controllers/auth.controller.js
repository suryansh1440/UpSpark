export const login = (req, res) => {
    const { username, password } = req.body;
    // Dummy authentication logic
    if (username === 'admin' && password === 'password') {
        return res.status(200).json({ message: 'Login successful' });
    }  else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
};