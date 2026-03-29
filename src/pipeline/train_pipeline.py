from src.components.data_ingestion import DataIngestion
from src.components.data_transformation import DataTransformation
from src.components.model_trainer import ModelTrainer


if __name__ == "__main__":
    
    # # loading and splitting dataset into train and test
    obj = DataIngestion()
    train_data, test_data = obj.initiate_data_ingestion()

    # # transformation of data
    data_transformation = DataTransformation()
    train_arr, test_arr, _ = data_transformation.initiate_data_transformation(train_data, test_data)

    # training the models and applying hyper-parameter tuning
    # to find the best model in regression
    model_trainer = ModelTrainer()
    print(model_trainer.initiate_model_trainer(train_arr, test_arr))



