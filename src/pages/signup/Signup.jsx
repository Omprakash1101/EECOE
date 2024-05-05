import { useState, useEffect } from "react";
import { useSignup } from "../../hooks/useSignup";
import { useHistory } from "react-router-dom";
import saveAs from "file-saver";
import ExcelJS from "exceljs";
import styles from "./Signup.module.css";
import { useCollection } from "../../hooks/useCollection";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { fireStore } from "../../firebaseDatabase/config";
import Footer from "../../components/Footer";

export default function Signup() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [department, setDepartment] = useState("CSC");
  const [year, setYear] = useState("3");
  const [semester, setSemester] = useState("5");
  const [section, setSection] = useState("A");
  const [registerNumber, setRegisterNumber] = useState("");
  const [isEnroll, setIsEnroll] = useState(false);

  const { signup, isPending, error } = useSignup();
  const history = useHistory();
  const [tem,settem] = useState(false);

  function handleClick() {
    settem(!tem);
    history.push("/login");
    window.location.reload(true);
  }
  function sliceReg(e) {
    if (e.length == 12) { // To validate register number size
      const temp = e.slice(4, 6); //To fix the year and sem using register number from input
      if (temp == "22") {
        setSemester("5");
        setYear("3");
      } else if (temp == "21") {
        setSemester("7");
        setYear("4");
      }

      const temp1 = e.slice(6, 9); // To fix the department using register number from user input
      if (temp1 == "205") {
        setDepartment("IT");
      } else if (temp1 == "102") {
        setDepartment("AE");
      } else if (temp1 == "103") {
        setDepartment("CE");
      } else if (temp1 == "104") {
        setDepartment("CSC");
      } else if (temp1 == "105") {
        setDepartment("EEE");
      } else if (temp1 == "106") {
        setDepartment("ECE");
      } else if (temp1 == "107") {
        setDepartment("EIE");
      } else if (temp1 == "114") {
        setDepartment("MECH");
      } else if (temp1 == "121") {
        setDepartment("BME");
      } else if (temp1 == "125") {
        setDepartment("RAE");
      } else if (temp1 == "243") {
        setDepartment("AIDS");
      } else if (temp1 == "148") {
        setDepartment("AIML");
      } else if (temp1 == "149") {
        setDepartment("CSC-CS");
      }
    }
    else if(e.length === 0){
        console.log("hi");
    }
  }

  const checkRegisterNumberExists = async (regNumber) => {
    try {
      const userRef = fireStore
        .collection("users")
        .where("registerNumber", "==", regNumber);
      const snapshot = await userRef.get();
      return !snapshot.empty; // Return true if register number exists, false otherwise
    } catch (error) {
      console.error("Error checking register number:", error);
      return false; // Return false in case of error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const regNumber = registerNumber.replace(/\D/g, ""); // Remove non-numeric characters
    const isValidLength = regNumber.length === 12; // Check if the length is 12
    const isValidPrefix = regNumber.startsWith("3106"); // Check if it starts with 3106

    if ((!isValidLength || !isValidPrefix)&&(!tem)) {
      // Display an error message if the input format is invalid
      alert("Invalid register number format");
      return;
    }

    // Check if the register number already exists
    const registerExists = await checkRegisterNumberExists(registerNumber);
    if (registerExists) {
      alert("Register number already exists. Contact if this is a mistake");
      return;
    }

    // If register number doesn't exist, proceed with signup
    signup(
      {
        email,
        password,
        displayName,
        registerNumber,
        department,
        year,
        section,
        semester,
        isEnroll,
      },
      handleDownloadPassword
    );
  };

  const handleDownloadPassword = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Password");
    worksheet.addRow(["User name:",email]);    // Add Username to the worksheet
    worksheet.addRow(["Password:", password]); // Add password to the worksheet

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "password.xlsx"); // Trigger download
    });
  };

  return true ? (
    <>
      <Footer />

      <form onSubmit={handleSubmit} className={styles["signup-form"]}>
        <h2>Sign Up</h2>
        <label>
          <span>Full Name:</span>
          <input
            type="text"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </label>
        <label>
          <span>Create Password:</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <label>
          <span>Register Number:</span>
          <input
            type="text"
            onChange={(e) => {
              setRegisterNumber(e.target.value);
              sliceReg(e.target.value);
            }}
            value={registerNumber}
          />
        </label>
        <label>
          <span>Department:</span>
          <select
            name="Department"
            id="selectList"
            disabled={true}
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
          >
            <option value="CSC">Computer Science</option>
            <option value="IT">Information Technology</option>
            <option value="ECE">
              Electronics and Communication Engineering
            </option>
            <option value="EEE">Electrical and Electronic Engineering</option>
            <option value="AE">Automobile Engineering</option>
            <option value="EIE">
              Electronics and Instrumentation Engineering
            </option>
            <option value="BME">Biomedical Engineering</option>
            <option value="RAE"> Robotics and Automation Engineering</option>
            <option value="AIML">
              {" "}
              Artificial Intelligence and Machine Learning
            </option>
            <option value="CSC-CS"> Cyber Security</option>

            <option value="CE">Civil Engineering</option>
            <option value="MECH">Mechanical Engineering</option>
            <option value="AIDS">
              Artificial Intelligence and Data Science
            </option>
          </select>
        </label>
        <label>
          <span>Semester:</span>
          <select
            name="Semester"
            id="selectList"
            disabled={true}
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
            }}
          >
            <option value="5">5th semester</option>
            <option value="7">7th semester</option>
          </select>
        </label>
        <label>
          <span>Section:</span>
          <select
            name="Section"
            id="selectList"
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
            }}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </label>

        <label>
          <span>Email:</span>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>

        {!isPending && <button className={styles.btn}>Sign Up</button>}
        {isPending && (
          <button className="btn" disabled>
            loading
          </button>
        )}
        {error && <p>{error}</p>}
        <button className={styles.btn1} onClick={handleClick}>
          Already an User? Login Instead
        </button>
      </form>
    </>
  ) : (
    <div className={styles["signup-form"]}>
      <h2>Registration is closed</h2>
    </div>
  );
}
