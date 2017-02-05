from flask import Flask, request, render_template, session, send_from_directory




app = Flask(__name__, static_url_path='')


app.secret_key = "super secret key"

# Run in debugging mode
app.debug = True


@app.route("/")
def home():

	return	app.send_static_file('acss.html')


if __name__ == "__main__":
    app.run()
