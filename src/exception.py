import sys
import logging

def error_message_detail(error, error_detail: sys):
    """
    Returns a detailed error message with the file name, line number, and original error message.
    """
    _, _, exc_tb = error_detail.exc_info()  
    file_name = exc_tb.tb_frame.f_code.co_filename
    line_number = exc_tb.tb_lineno
    error_message = f"Error occurred in python script name [{file_name}] line number [{line_number}] error message [{str(error)}]"
    return error_message



class CustomException(Exception):
    def __init__(self, error_message, error_detail: sys):
        # Correct super() call
        super().__init__(error_message)
        # Store the detailed error message
        self.error_message = error_message_detail(error_message, error_detail)

    def __str__(self):
        return self.error_message
        



# if __name__ == "__main__":
#     logging.info("Logging has started")

#     try:
#         a = 1 / 0
#     except Exception as e:
#         logging.info("Divide By Zero")
#         raise CustomException(e, sys)