import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import moment from 'moment';
import collections from '../../collections'; // Assuming collections are exported correctly
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const AssessmentDetails = () => {
  const [assessments, setAssessments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assessmentId: '',
    title: '',
    language: 'English', // Default language
    topic: '',
    duration: '',
    questions: [],
    startDate: '',
    startTime: '', // New state for start time
    endDate: '',
    endTime: '', // New state for end time
    questionType: 'manual'
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // State for selected language
  const [isFormCollapsed, setIsFormCollapsed] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const assessmentsSnapshot = await getDocs(collections.assessments);
      const assessmentsData = assessmentsSnapshot.docs.map((doc, index) => {
        const data = doc.data();
        // Handle date conversion properly
        return {
          id: doc.id,
          serialNo: index + 1, // Serial number based on index (1-based)
          ...data,
          startDate: data.startDate ? new Date(data.startDate.seconds * 1000) : null, // Convert Firestore timestamp to JavaScript Date
          endDate: data.endDate ? new Date(data.endDate.seconds * 1000) : null       // Convert Firestore timestamp to JavaScript Date
        };
      });
      setAssessments(assessmentsData);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleAddAssessment = () => {
    setShowForm(true);
    setIsFormCollapsed(false);
  };
  const handleCollapseForm = () => {
    setIsFormCollapsed(true);
    setShowForm(false); // Hide form when collapsing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form fields
      if (!formData.assessmentId || !formData.title || !formData.startDate || !formData.endDate || !formData.language || !formData.topic || !formData.duration) {
        console.error('Please fill out all required fields');
        return;
      }

      const newAssessment = {
        ...formData,
        startDate: new Date(`${formData.startDate}T${formData.startTime}`), // Combine date and time
        endDate: new Date(`${formData.endDate}T${formData.endTime}`)         // Combine date and time
      };

      if (formData.questionType === 'pdf' && pdfFile) {
        // Handle PDF file upload and processing here
        // Example: newAssessment.pdfFile = await uploadPdfFile(pdfFile);
      }

      await addDoc(collection(db, 'assessments'), newAssessment);

      setShowForm(false);
      // Clear form fields
      setFormData({
        assessmentId: '',
        title: '',
        language: 'English',
        topic: '',
        duration: '',
        questions: [],
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        questionType: 'manual'
      });
      setPdfFile(null);
      fetchData(); // Refresh assessments list
    } catch (error) {
      console.error('Error adding assessment:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      questions: newQuestions
    }));
  };

  const addQuestionField = () => {
    setFormData(prevState => ({
      ...prevState,
      questions: [...prevState.questions, '']
    }));
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleLanguageChange = (e) => {
    const { value } = e.target;
    setSelectedLanguage(value); // Update selected language
    updateQuestionsLanguage(value); // Update questions based on selected language
  };

  const updateQuestionsLanguage = (language) => {
    const updatedQuestions = formData.questions.map((question, index) => {
      // Replace questions with translations or language-specific versions
      return `${question} (${language})`;
    });
    setFormData(prevState => ({
      ...prevState,
      questions: updatedQuestions
    }));
  };

  const renderAssessmentStatus = (assessment) => {
    if (!assessment.startDate || !assessment.endDate) {
      return <span className="text-danger">Invalid Date</span>;
    }

    const startDate = moment(assessment.startDate);
    const endDate = moment(assessment.endDate);
    const now = moment();

    if (now.isBefore(startDate)) {
      return <span className="text-success">Upcoming</span>;
    } else if (now.isBetween(startDate, endDate)) {
      return <span className="text-primary">Ongoing</span>;
    } else {
      return <span className="text-danger">Expired</span>;
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      await deleteDoc(doc(db, 'assessments', assessmentId));
      fetchData(); // Refresh assessments list after deletion
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="content mt-5 mb-5">
      <div className="container mt-5">
        <h1 className="mb-4" style={{marginTop: '4rem'}}>Assessment Details</h1>
        {!showForm && (
            <button className="btn btn-primary mb-3" onClick={handleAddAssessment}>Add Assessment</button>
          )}


        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="assessmentId" className="form-label">Assessment ID</label>
              <input type="text" className="form-control" id="assessmentId" name="assessmentId" value={formData.assessmentId} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="language" className="form-label">Language</label>
              <select className="form-control" id="language" name="language" value={formData.language} onChange={handleInputChange}  required>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                {/* Add more languages as needed */}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="topic" className="form-label">Topic</label>
              <input type="text" className="form-control" id="topic" name="topic" value={formData.topic} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="duration" className="form-label">Duration</label>
              <input type="text" className="form-control" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Question Type</label>
              <select className="form-control" name="questionType" value={formData.questionType} onChange={handleInputChange} required>
                <option value="manual">Manual</option>
                <option value="pdf">Upload PDF</option>
              </select>
            </div>
            {formData.questionType === 'manual' ? (
              <>
                {formData.questions.map((question, index) => (
                  <div className="mb-3" key={index}>
                    <label htmlFor={`question-${index}`} className="form-label">Question {index + 1} ({selectedLanguage})</label>
                    <input type="text" className="form-control" id={`question-${index}`} value={question} onChange={(e) => handleQuestionChange(index, e)} />
                  </div>
                ))}
                <button type="button" className="btn btn-secondary mb-3" onClick={addQuestionField}>Add Question</button>
              </>
            ) : (
              <div className="mb-3">
                <label htmlFor="pdfFile" className="form-label">Upload Questions PDF</label>
                <input type="file" className="form-control" id="pdfFile" name="pdfFile" onChange={handleFileChange} required />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input type="date" className="form-control" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">Start Time</label>
              <input type="time" className="form-control" id="startTime" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input type="date" className="form-control" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">End Time</label>
              <input type="time" className="form-control" id="endTime" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
            </div>
            <button className="button-group" style={{ display: 'flex', gap: '10px', border: 'none', backgroundColor: 'white' }}>
            <button type="submit" className="btn btn-success" >Save</button>
            <button className="btn btn-warning" onClick={handleCollapseForm}>Collapse Form</button>
            </button>
          </form>
        )}
        

        <table className="table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment) => (
              <tr key={assessment.id}>
                <td>{assessment.serialNo}</td>
                <td>{assessment.title}</td>
                <td>{assessment.startDate ? moment(assessment.startDate).format('YYYY-MM-DD HH:mm') : 'Invalid Date'}</td>
                <td>{assessment.endDate ? moment(assessment.endDate).format('YYYY-MM-DD HH:mm') : 'Invalid Date'}</td>
                <td>{renderAssessmentStatus(assessment)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDeleteAssessment(assessment.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className="row">
          {assessments.map((assessment) => (
            <div className="col-md-6" key={assessment.id}>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{assessment.title}</h5>
                  <p className="card-text">Language: {assessment.language}</p>
                  <p className="card-text">Topic: {assessment.topic}</p>
                  <p className="card-text">Duration: {assessment.duration}</p>
                  <p className="card-text">Status: {renderAssessmentStatus(assessment)}</p>
                  <button className="btn btn-danger" onClick={() => handleDeleteAssessment(assessment.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div> */}

      </div>
      </div>
      <Footer/>
    </>
    
  );
};

export default AssessmentDetails;
