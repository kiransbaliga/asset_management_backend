import { ValidationError } from "class-validator";
import HttpException from "./http.exception";

class ValidationErrors extends HttpException {
    public errors: any;


    constructor(status: number, message: string, errors: ValidationError[]) {
        super(status,message);

        this.errors = this.generateError(errors);
    
    }

    private generateError(errors: ValidationError[]) {
        let errorObject: Object = {};

        for (const error of errors) {
            const property = error.property;
            const constraints = error.constraints;
            
            if (error.children.length > 0) {
                errorObject[property] = this.generateError(error.children);
            } else {
                errorObject[property] = Object.values(constraints);
            }
        }
    
        return errorObject;
    }
}

export default ValidationErrors;