import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("You have to upload a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "https://<API_GATEWAY_URL>/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setMessage("Your file is uploaded successfully:" + response.data.message);
        } catch (error) {
            setMessage("The upload failed, please try again: " + error.response?.data?.message || error.message);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Please upload your File here:</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
};

export default App
export { App };
