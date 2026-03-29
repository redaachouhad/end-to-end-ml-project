from flask import Flask, request, jsonify, render_template

from src.pipeline.predict_pipeline import PredictPipeline, CustomData

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict_datapoint():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        required_fields = [
            'gender',
            'race_ethnicity',
            'parental_level_of_education',
            'lunch',
            'test_preparation_course',
            'reading_score',
            'writing_score'
        ]

        for field in required_fields:
            if field not in data or data[field] in [None, ""]:
                return jsonify({"error": f"{field} is required"}), 400

        # Safe conversion
        try:
            reading_score = float(data.get('reading_score'))
            writing_score = float(data.get('writing_score'))
        except ValueError:
            return jsonify({"error": "Scores must be numeric"}), 400

        # Range validation
        if not (0 <= reading_score <= 100 and 0 <= writing_score <= 100):
            return jsonify({"error": "Scores must be between 0 and 100"}), 400

        custom_data = CustomData(
            gender=data.get('gender'),
            race_ethnicity=data.get('race_ethnicity'),
            parental_level_of_education=data.get('parental_level_of_education'),
            lunch=data.get('lunch'),
            test_preparation_course=data.get('test_preparation_course'),
            reading_score=reading_score,
            writing_score=writing_score
        )

        pred_df = custom_data.get_data_as_data_frame()

        pipeline = PredictPipeline()
        result = pipeline.predict(pred_df)

        return jsonify({
            "prediction": float(result[0])
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)