class ApiResponse{
    constructor(statusCode,message="success",success,data){
        this.data=data
        this.statusCode=statusCode
        this.success=success
        this.message=message
    }
}

export {ApiResponse}