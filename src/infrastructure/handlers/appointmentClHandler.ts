
export const main = async (event: any) => {
    console.log("Handling event");
    console.log(event);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from appointmentClHandler!',
        }),
    };
}