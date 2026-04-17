import { useState } from "react";
import Navpar from "../../Components/Navpar";
import "./upload.css";
import { usePuterStore } from "../../lib/puter";
import { convertPdfToImage } from "../../lib/pdf2img";

import { v4 as uuidv4 } from 'uuid';
import {  useNavigate } from "react-router";
import { prepareInstructions } from "../../data.jsx";

function Upload() {


    const {  fs, ai, kv } = usePuterStore();
    const [IsProcessing, SetIsProcessing] = useState(false);
    const [StatusText, SetStatusText] = useState("");
        const navigate = useNavigate();

    let [File, SetFile] = useState(null);
    const [Error, SetError] = useState("");
    let [DataForms, SetDataForms] = useState({
      companyName: "",
      jobTitle: "",
      jobDescription: "",
      resumeFile:null,
    });


    function handleFile(file) {

      const maxFileSize = 10 * 1024 * 1024;
      if (!file) {
        SetFile(null);
        return;
      }
      if (file.size > maxFileSize) {
        SetFile(null);
        SetError("حجم الملف يجب ألا يتجاوز 10MB");
        SetDataForms({
          ...DataForms,
          resumeFile: null,
        });
        return;
      }
      SetFile(file);
      SetError("");

      SetDataForms({
        ...DataForms,
        resumeFile: file,
      });
  }

    function handleDeleteFile() {
        SetFile(null);
        SetDataForms({
          ...DataForms,
          resumeFile: null,
        });
    }
  // console.log(File);

  async function handleAnalyze(dataform){
    console.log(dataform)
    SetIsProcessing(true)
    // رفع الملف
    SetStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([dataform.resumeFile]);
    if(!uploadedFile) return SetStatusText("Error: Failed to upload file");

    // تحويل PDF إلى صورة
    SetStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(dataform.resumeFile);
    if (!imageFile.file) return SetStatusText("Error: Failed to convert PDF to image");

    // رفع الصورة
    SetStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return SetStatusText("Error: Failed to upload image");


    // بناء البيانات النهائية
    SetStatusText("Preparing data...");
    const uuid = uuidv4();
    const data = {
    id: uuid,
    resumePath: uploadedFile.path,
    imagePath: uploadedImage.path,
    companyName : dataform.companyName,
    jobTitle: dataform.jobTitle,
    jobDescription: dataform.jobDescription,
    feedback: "",
    };

    // حفظ البيانات الأولية في KV
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    // طلب التحليل من AI
    SetStatusText("Analyzing...");
    // console.log("Data sent to AI:", data);
    const feedback = await ai.feedback(
    uploadedFile.path,
    prepareInstructions({ jobTitle: dataform.jobTitle, jobDescription: dataform.jobDescription }),
    );
    if (!feedback) return SetStatusText("Error: Failed to analyze resume");


    // معالجة رد AI
    const feedbackText =
    typeof feedback.message.content === "string"
    ? feedback.message.content
    : feedback.message.content[0].text;

    // console.log("Feedback received from AI:", feedbackText);
    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    SetStatusText("Analysis complete, redirecting...");

// console.log("Final data saved to KV:", data);
    // console.log(data);
    navigate(`/resume/${uuid}`);

  }




  return (
    <main className="upload-page d-flex align-items-start py-4 py-md-5">
      <div className="container">
        <div className="upload-inner  py-4 py-lg-5">
          <Navpar />
          
          <header className="upload-header text-center mx-auto">
            <h1 className="upload-title mb-3">
              Smart feedback for your dream job
            </h1>
            {IsProcessing ? (
              <div className="upload-scan">
                <h2 className="mt-4">{StatusText}</h2>
                <img src="/images/resume-scan.gif" className="resume-scan " />
              </div>
            ) : (
              <p className="upload-subtitle mb-0">
                Drop your resume for an ATS score and improvement tips.
              </p>
            )}
          </header>
          {!IsProcessing && (
            <form
              className="upload-form mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                handleAnalyze(DataForms);
                console.log(DataForms.resumeFile);
              }}
            >
              <div className="w-100">
                <label
                  htmlFor="companyName"
                  className="upload-label mb-2 d-block"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="company-name"
                  type="text"
                  className="upload-input border-0"
                  placeholder="JavaScript Mastery"
                  value={DataForms.companyName}
                  onChange={(e) =>
                    SetDataForms({ ...DataForms, companyName: e.target.value })
                  }
                />
              </div>

              <div className="w-100">
                <label htmlFor="jobTitle" className="upload-label mb-2 d-block">
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  name="job-title"
                  type="text"
                  className="upload-input border-0"
                  placeholder="Frontend Developer"
                  value={DataForms.jobTitle}
                  onChange={(e) =>
                    SetDataForms({ ...DataForms, jobTitle: e.target.value })
                  }
                />
              </div>

              <div className="w-100">
                <label
                  htmlFor="jobDescription"
                  className="upload-label mb-2 d-block"
                >
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  name="job-description"
                  className="upload-input upload-textarea border-0"
                  placeholder="Write a clear & concise job description with responsibilities & expectations..."
                  value={DataForms.jobDescription}
                  onChange={(e) =>
                    SetDataForms({
                      ...DataForms,
                      jobDescription: e.target.value,
                    })
                  }
                />
              </div>

              <div className="w-100">
                <label
                  htmlFor="resumeFile"
                  className="upload-label mb-2 d-block"
                >
                  Upload Resume
                </label>
                <div className="upload-dropzone">
                  {File ? (
                    <>
                      <div className="upload-file">
                        <img
                          className="upload-file-icon"
                          src="/images/pdf.png"
                          alt=""
                        />
                        <div className=" text-center">
                          <h2 className="upload-drop-title">{File.name}</h2>
                          <p className="upload-drop-note mb-0">
                            {(File.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <img
                          className="upload-file-icon-cross"
                          src="/icons/cross.svg"
                          alt=""
                          onClick={() => handleDeleteFile()}
                        />
                      </div>
                    </>
                  ) : (
                    <label htmlFor="resumeFile" className="upload-drop w-100">
                      <input
                        id="resumeFile"
                        className="d-none"
                        type="file"
                        name="upload-file"
                        accept=".pdf,application/pdf"
                        onChange={(event) => {
                          handleFile(event.target.files[0]);
                          console.log(event.target.files[0]);
                        }}
                      />

                      <img
                        className="upload-drop-icon mb-2"
                        src="/icons/info.svg"
                        alt=""
                      />
                      {!Error ? (
                        <>
                          <p className="upload-drop-title mb-1">
                            Click to upload <span>or drag and drop</span>
                          </p>
                          <p className="upload-drop-note mb-0">
                            PDF, PNG or JPG (max 10MB)
                          </p>
                        </>
                      ) : (
                        <p className="upload-drop-title mb-1"> {Error}</p>
                      )}
                    </label>
                  )}
                </div>
              </div>

              <button type="submit" className="upload-submit border-0">
                Save & Analyze Resume
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Upload;
