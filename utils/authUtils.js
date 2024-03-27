import bcrypt from 'bcrypt'

export const hashPassword = async(password)=>{
    try {
        
        const hashedPassword = await bcrypt.hash(password,10)
        return hashedPassword
        // throw new Error('Simulated hashing error');
        
    } catch (error) {
        console.log(error)
        
    }
}

export const comparePassword = async(password,hashedPassword)=>{
     return bcrypt.compare(password,hashedPassword)
}