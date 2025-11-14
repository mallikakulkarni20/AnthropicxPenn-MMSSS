from flask import Flask
# from flask_cors import CORS

from routes.health_routes import health_bp
from routes.lectures_routes import lectures_bp
from routes.student_routes import student_bp
from routes.teacher_routes import teacher_bp
from routes.ai_routes import ai_bp


def create_app():
    app = Flask(__name__)
    # CORS(app)

    # Register blueprints (all prefixed with /api except health)
    app.register_blueprint(health_bp)
    app.register_blueprint(lectures_bp, url_prefix="/api")
    app.register_blueprint(student_bp, url_prefix="/api")
    app.register_blueprint(teacher_bp, url_prefix="/api")
    app.register_blueprint(ai_bp, url_prefix="/api")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
