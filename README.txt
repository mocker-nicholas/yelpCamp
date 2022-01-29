1. Create a folder with a readme and git ignore file
2. NPM init to get yourself a package.json and your node_modules
3. Install all of your dependencies.
    a. Express
        - const app = express();
        // allow requests to have bodys
        - app.use(express.urlencoded({extended: true}))
    b. Mongoose
    c. Method Override
        - app.use('methodOverride('_method'))
        // allow a method to be passed in a query string to override form action
    d. If using ES6 import Statements:
        i. path
        - const __dirname = path.dirname(__filename);
        ii. {fileToUrlPath} from url
        - const __filename = fileURLToPath(import.meta.url);
        - TO GET FILENAME AND DIRNAME IN A MODULE WE HAVE TO SNAG THOSE INDIVIDUALLY. IMPORTING PATH DOES NOT DO THIS FOR US. DIRNAME AND FILENAME WILL BE UNDEFINED IF WE DONT DO THIS
    e. Ejs
4. Create your app/index js, and import all of your modules
5. Tell your app to listen on a port locally for development
    - app.listen(port, callback);
    - make an app.get() to go ahead and check if everything is A OK at this point
6. Make a views directory for you views engine (ejs)
    a. set views engine - app.set('view engine', 'ejs')
    b. set view directory -  app.set('views', path.join(__dirname, 'views'))
7. Make the models/schemas for your db
    - const yourSchema = new Mongoose.Schema({keyvaluepairsinhere})
    - you may need to export your shema to another file
    a. connect to the Database
    async function connectDb() {
        try {
            await mongoose.connect("mongodb://localhost:27017/yelp-camp");
            console.log("DATABASE CONNECTED");
            } catch (e) {
            console.log("CONNECTION ERROR", e);
                }
            }
            connectDb();
8. Set up your basic routes for CRUD
    a. You are going to have create, read(show), update, delete
    b. The most important is consistent url pattern associated with HTTP verbs
        i. GET /things
        ii. GET /things/{id} (also called SHOW route)
        iii. PATCH /things/{id}
        iv. DELETE /things/{id}
        v. POST /things/new
    c. HOT TAKE, 
        i. when passing data from forms. Your input names can be name="model[parameter]"
            if you want the req.body.model to actually represent what you passed
            const objectPassed = req.body.model
            ii. otherwise, you can name="param", and get them individually from req.body.paramName
9. Adding some Basic Styles
    a. Ejs has an extension called ejs-mate. It lets you abstract a boilerplate for your header/footer
        - make your boilerplate in a layouts folder
        - add <% - body -> where where page content will go
        - make a view that contains the body and include the path to the boilerplate at the top
        - <% layout('pathtoboilerplate') %>
    b. If you are using <%- body -> put a container around it in the boilerplate
    c. Create your partials
        - create a folder in your views directory for your partials
        - include a partial on the boilerplate by placing 
            include('pathtopartial') wherever you want that content
10. Error Handling
    a. Your project really needs to have both client side and server side validation
    b. Bootstrap
        i. Tell the browser not to validate the form
        ii. add required attribute to your inputs
        iii. you will need to add in boostraps custom form validation script. 
        iv. add divs with .valid-feedback that appear when input meets requirements
    c. Error Class
        i. Create a util folder for your error stuff
        ii. Create an error Class
            - class ExpressError extends Error {
                constructor(statusCode, message) {
                    super(); <----- you need super to change any of the values of the class you extend.
                    this.statusCode = statusCode;
                    this.message = message;
                    }
                }
             - Note: you cant throw this error normally in an async function. you would have
                to return next(error) or express breaks. Write a higher order function to catch
                any error in an async function, and pass it into next, so you dont have to 
                write this out individually for every route.
        iii. Write a function that accepts a function as an arg. The function will
                return another function that calls the function that was passed in, and will 
                catch any errors on the passed in function and pass them into next. 
                - function catchAsync(fn) {
                    return (req, res, next) => {
                    fn(req, res, next).catch(next(e));
                    };
                }
                - this will catch errors in async functions, and will pass them to our app.use() error
                    handler at the end of the file. 
    d. More Error Handling
        i. use an app.all('*') at the end of your file to catch any req routes that dont exist
            You can throw an error here, and pass it into next
        ii. app.use() afterwards will catch the error you threw into next. 
        iii. After you set that up, you can throw an error in any route, and it will
                get passed to the app.use error handler on the bottom. 
    e. Defining Error Template
        i. You can throw this in the top level of views folder, since it really is
            another page you are going to show your peeps
11. Validation
    a. JOI Schema Validations
        i. We need client AND server side validation. 
        ii. JOI works by writing a schema for a js object. It will validate your request before
            anything gets to mongoose if you set the schema for the req body. 
        iii. Define a schema, set it to a var, and then call validate on the object that needs to be validated
            -     const campgroundSchema = JOI.object({
                campground: JOI.object({
                        title: Joi.string().required(), <-------- Make sure youre keys match the keys passed in req.body
                        price: Joi.number().required().min(0),
                    }).required(),
                });
                const result = campgroundSchema.validate(req.body);
        iv. We will want to destructure an error out of the validate(obj) method if there is one.
            JOI errors return 'details' which is an array of objects that contain a message. 
            Therefore, we would check for an error, and if there is one, map over the details array, 
            return the messages, and join them at the comma that seperates them. 
                -  const { error } = campgroundSchema.validate(req.body);
                        if (error) {
                            const msg = error.details.map((el) => el.message).join(",");
                            throw new ExpressError(400, msg);
                        }
    b. JOI validation middleware
        i. Movie your code for req schema validation in to its own middleware function
        ii. You also dont want to define your Schema everytime. Move your schema
            definition used in the middleware into a different file if you can. 
12. Making a review module for our camps
    a. Reviews are probably going to be a one to many relationship. For this app,
        we are going to embed a reference to the child (review), on the parent (campground)               
    b. After you define a model, you need to decide where you will make that new data and add that route
    c. Once the form is added, set up the form to hit your route. Confirm the data is being submitted and is
        being added to the Database
    d. Add another validation schema, and create that middleware to pass through to our new route.
    e. displaying those reviews is as easy as populating them on the campground show page.
        IMPORT NOTE
            - At this point, some of this stuff is getting repetitive. Basically, for every new 'Thing' you want to add, 
                1. Find out how it relates to other things and how you want to display it
                2. Create your schema and model
                    - add references to the parent and childs as necessary
                3. add a route to create the thing
                4. add a template or to another template for where you want to create it and show it
                    - make sure this works
                5. pass your error handler onto those routes or make one special if needed
                6. create some sort of validation schema for the data for the Thing
                7. Make the thing look nicer once its all working. 
                8. add the ability to delete and update the thing if you want
                    - if parent/child delete all references
                9. add what happens to parent/child once thing is deleted
    f. Say we want to delete a child, but there is a reference to it in an array on the parent?
       The recommended solution is pull:
        - findByIdAndUpdate(parentId, { $pull: { childarr: childId },
    g. Deleting the parent can make use of a middleware on the model to get rid of children
        - Whatever method you are using to find the parent, will have an associated middleware
          type it triggers. Document, Query, Pre, and Post.
        - SPECIFIC MIDDLEWARE METHODS ARE ONLY TRIGGERED BY THE SPECIFIC METHOD BEING USED TO FIND DOCUMENT
13. Splitting up our routes
    a. To split up routes, make a folder called routes, and some files for your route categories
    b. set const router = express.Router() and export default router.
    c. Import that router into your app file, with the prefix for that route category
        - import catRouter from './pathtocatroutefile'
        - app.use('/category', catRouter)
    d. Your imports will be messed up now. You will have to bring everything you are 
        using into your router file. 
    e. Also, make sure to remove '/category' from the routes in your new router file
    f. if you have ids in your base urls for your router, you will need to pass 
        this option to your express router instance:
         - const router = express.Router({mergeParams: true})
           - This option merges the params in your base url with the params being
             being defined in your routes. You cant access params in your base url
            for your router by default. 
14. Serving static assets
    a. You can use app.use(app.static()) to serve static assets from you main app file
        - app.use(app.static('filetoserve'))
15. Add session storage to your app
    a. npm i install express-session
    b. define a config object to pass into your session initialization
       - app.use(session(sessionConfig));
          i. THIS SHOULD COME BEFORE YOUR ROUTES or it will be missed
    c. You can pass in a cookie object to your config for some settings:
        i. {
                httpOnly: true, <-- prevent cross site scripting
                expires: Date.now() + 1000 * 60 * 60 * 24 * 7, <-- Expires a week from now
                maxAge: 1000 * 60 * 60 * 24 * 7, <-- one week
            },
16. Setting up Flash
    a. npm i Flash
        - app.use(flash());
    b. to use flash in a route:
        - req.flash('key', 'value message')
        - You then need to pass it into whatever route you are using that message on.
          so if you are redirecting, pass it into the route you are redirecting to.
        - A better way to do this is to define a middleware that will look for a flash message.
           You can add your req.flash.success key to res.locals.success. 
           - this adds the contents of our flash success to the locals object of every response
           - you have access to this in your templates automtically.
17. Making a partial for flash
    - extract your flash messages into a partial
    -  You will want to check to see if the key you assigned (success or error)
        contains an empty array in your template, before displaying your error partial. 
    b. To put in a partial for a flash error, we can use the same partial as above
        - we will want to check for an error in that partial, and display it if their is one
        - then we can redirect to a different page (with the error partial included)
            i. Think about what routes could have an error. If you are finding something, 
                you could pass in a flash error if that item is not found. 
                 -router.get(
                    "/:id",
                    catchAsync(async (req, res) => {
                        const thing = await Thing.findById(req.params.id).populate(
                            "things"
                        );
                        if (!thing) {
                            req.flash("error", "Thing not found");
                            return res.redirect("/things");
                        }
                        res.render("things/show", { thing });
                        })
                    );
18. Yelpcamp Authentication (passport)
    a. Using a tool like passport allows us to add in third party authentication
    (google, twitter, facebook) really easily. 
    b. The first thing we need to do is set up a model
        - after we set up our schema Schema.plugin(passportLocalMongoose) will
        give us our username and password fields without any additional work or 
        validation.
    c. Configure app for passport:
        i. Include passport and passport local in main file
        ii. Tell app to use passport.intialize() and passport.session()
            - make sure normal session is called before passport session
        iii. Tell passport to use a local strategy to authenticate username
            - passport.use(new LocalStrategy(User.authenticate()));
        iv. Tell passport how to store a user in the session
            - passport.serializeUser(User.serializeUser());
        v. Tell passport how to get a user out of the session
    d. Registration
        - Make a new router for all of your registration routes. We can call it users
    e. We will need to serve a form to sign up, and login, and make request routes to send 
        the information to create an account, or login to app. 
    