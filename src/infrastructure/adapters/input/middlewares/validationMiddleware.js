export const validateRegister = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    next();
  };
  
  export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }
    
    next();
  };

export const validateUuidParam = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (typeof value !== 'string' || !uuidRegex.test(value)) {
    return res.status(400).json({ error: `El parámetro ${paramName} debe ser un UUID válido` });
  }
  next();
};
