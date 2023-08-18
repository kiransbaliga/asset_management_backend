import RolesController from "../controller/roles.controller";

const rolesController=new RolesController()
const rolesRoute = rolesController.router;

export default rolesRoute;