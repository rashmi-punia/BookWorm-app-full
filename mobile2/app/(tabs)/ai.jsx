import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import stylesImp from "../../assets/styles/profile.styles";

export default function AskPdfScreen() {
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  //   console.log("pdffile", pdfFile);

  const pickPdfFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!result.canceled && result.assets?.length > 0) {
        setPdfFile(result.assets[0]);
        setAnswer("");
        setQuestion("");
      }
    
    } catch (error) {
      console.log("PDF Picker Error:", error);
    }
  };

  const handleAskQuestion = async () => {
    if (!pdfFile || !question) return;

    setLoading(true);

    try {
      // Example function – replace with real backend or AI API logic
      const response = await fetch('http://192.168.184.229:8000/get_answer',{
        method:"POST",
        body: JSON.stringify({
          question: question
        }),
        headers:{
          'Content-Type':'application/json'
        }
      });
      const res = await response.json();
      setAnswer(res.answer);
    } catch (err) {
      console.error("Error getting answer:", err);
      setAnswer("Failed to fetch answer.");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Simulated function to mimic backend/AI answer
  const sendPdfAndQuestion = async () => {
    try {
      const formData = new FormData()

      formData.append('file',{
        uri: pdfFile.uri,
        name: pdfFile.name,
        type: pdfFile.mimeType || 'application/pdf'
      })

      const uploadResponse = await fetch(`http://192.168.184.229:8000/upload_and_prepare`,{
        method:"POST",
        body: formData,
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })
      
      if (uploadResponse.ok){
        alert("You can ask questions now")
      } else{
        alert("Error preparing file")
      }

    } catch (err) {
        console.log("Error sending the pdf: ", err)
        throw err
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        style={{
          fontSize: 22,
          textAlign: "center",
          marginVertical: 12,
          color: "#EC407A",
        }}
      >
        Upload your File to make use of Rag
      </Text>
      <TouchableOpacity style={stylesImp.logoutButton} onPress={pickPdfFile}>
        <Text style={stylesImp.logoutText}>📄 Pick PDF File</Text>
      </TouchableOpacity>

      {pdfFile && <Text style={styles.fileInfo}>Selected: {pdfFile.name}</Text>}

      {pdfFile && (
        <TouchableOpacity
        style={[stylesImp.logoutButton, { marginTop: 12 }]}
        onPress={sendPdfAndQuestion}
        disabled={loading}
      >
        <Text style={stylesImp.logoutText}>send file</Text>
      </TouchableOpacity>
      )}



      {pdfFile && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Ask a question about the PDF..."
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          <TouchableOpacity
            style={[stylesImp.logoutButton, { marginTop: 12 }]}
            onPress={handleAskQuestion}
            disabled={loading}
          >
            <Text style={stylesImp.logoutText}>Ask Question</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

          {answer !== "" && (
            <View style={styles.answerContainer}>
              <Text style={styles.answerHeading}>Answer:</Text>
              <Text style={styles.answerText}>{answer}</Text>
             
              <TouchableOpacity
                style={stylesImp.logoutButton}
                onPress={() => setQuestion("")}
              >
                <Text style={stylesImp.logoutText}>Ask another Question</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: "center",
  },
  fileInfo: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#555",
  },
  input: {
    marginTop: 20,
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 60,
    textAlignVertical: "top",
  },
  answerContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  answerHeading: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  answerText: {
    fontSize: 14,
    color: "#333",
  },
});
