import { asyncHandler} from '../utils/asyncHandler.js';

export const registerUser = async (req, res) => {
    try{
       res.status(200).json({message: 'User registered ' }); 
    }catch(error){
        res.status(500).json({message: 'Internal Server Error',
            error : error.message
        });
    }
}

