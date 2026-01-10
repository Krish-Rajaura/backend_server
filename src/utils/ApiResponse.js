class ApiResponse{
    constructor(statusCode,message="success",data,success){
        this.data=data
        this.statusCode=statusCode
        this.success=success
        this.message=message
    }
}

export {ApiResponse}