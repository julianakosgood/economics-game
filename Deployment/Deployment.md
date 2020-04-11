# Deployment Process


# Deployment Checklist


- [ ] Generate Django Secret Key
- [ ] Create environment file, or set environment variables
- [ ] Start Database server
- [ ] Build frontend static files (React/npm)
- [ ] Run Server


# Setting up the server/environment


For the app to run, several variables must be set in your environment. You may either create an environment file,
and use `source /path/to/file`, or set them manually. Environment variables can be found inside settings.py, if not listed below. IMPORTANT: do not commit these variables to source control for any version that holds sensitive data. Sure, you could maybe encrypt it, commit it, and decrypt when you deploy. The better alternative, though, is: Just Don't. 
As of writing, they are:

- DJANGO_SECRET_KEY: a random string for django's salt and hashing algorithms. Do not share this key for any version holding sensitive data. Further, do not change this for a version without the proper precautions, else the app will implode. See the django documentation for more information.
- DB_HOST: the host string for the database server
- DB_USER: user string
- DB_PASSWORD: password for db user.
- IS_DEV: optional flag for automated convienence settings for local dev and production.
- ALLOWED_HOSTS: list of hosts allowed to give requests to the application. 

If you or your server admin have strict traffic settings, you will likely have to configure iptables(or your server OS's equal) to allow traffic on whatever port you set django to. Per basis iptable rules are too varied and brittle to recommend much. If you know what you're doing, do what you need. If you aren't familiar, consult iptable documentation then call someone who has accidently locked themselves out of their server at least once, but remembered to set a systemd job to let them back in. 


# Database server


Start your server of choice, ensuring the creds match your env file. Once its up, you'll want to run `python manage.py migrate` in `backend/`. This creates all the needed tables for the application.

# Frontend static files


The frontend code is kept in a seperate directory for development. For production, you should run `npm run build` inside the `frontend/` directory to generate the static files for deployment. Django should be set to look in `frontend/build/` for static files. If for some reason it isn't, you can update that setting in `backend/settings.py`. Alternatively, you may just copy the generated build files to the default django static directory with something like `cp -r frontend/build backend/static/`



# Starting the server

With all the above, you should be able to run `python manage.py runserver` or with uwsgi if you wish to do so. For uwsgi, consult the uwsgi and django documentation.


# Documentation Reference

[Django Documentation](https://docs.djangoproject.com/en/3.0/)

[uWSGI Documentation](https://uwsgi-docs.readthedocs.io/en/latest/tutorials/Django_and_nginx.html)

[React Documentation](https://reactjs.org/docs/getting-started.html)

[React Deployment](https://create-react-app.dev/docs/deployment/)

[npm Documentation](https://docs.npmjs.com/)
