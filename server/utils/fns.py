import uuid
import os
import datetime


def generate_unique_filename(file_name):
    # Get the current timestamp
    current_time = datetime.datetime.now()
    timestamp = current_time.strftime("%Y%m%d%H%M%S")

    # Generate a unique identifier (UUID)
    unique_id = str(uuid.uuid4().hex)

    # Extract the file extension (e.g., .pdf, .jpg)
    file_extension = os.path.splitext(file_name)[1]

    # Combine the timestamp, unique_id, and file extension to create a unique name
    unique_filename = f"{timestamp}_{unique_id}{file_extension}"
    return unique_filename
