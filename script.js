const scholarships = [
    {
      name: "First Graduate Scholarship",
      category: "General",
      incomeLimit: 200000,
      minMarks: 60,
      requiredDocs: "Community Certificate, Income Certificate, First Graduate Certificate",
      explanation: "This scholarship supports first generation graduates from economically weaker sections.",
      deadline: "2025-07-31"
    },
    {
      name: "BC/MBC Post Matric Scholarship",
      category: "OBC",
      incomeLimit: 250000,
      minMarks: 60,
      requiredDocs: "Community Certificate, Income Certificate, Marksheet",
      explanation: "Aimed at students belonging to BC and MBC categories pursuing post-matric studies.",
      deadline: "2025-08-15"
    },
    {
      name: "SC/ST Post Matric Scholarship",
      category: "SC",
      incomeLimit: 250000,
      minMarks: 50,
      requiredDocs: "Caste Certificate, Income Certificate, Marksheet",
      explanation: "Designed for SC/ST students to support their higher education expenses.",
      deadline: "2025-06-30"
    },
    {
      name: "Moovalur Ramamirtham Scheme",
      category: "General",
      incomeLimit: 500000,
      minMarks: 60,
      requiredDocs: "Bank Passbook, Aadhar Card, College ID",
      explanation: "Provides financial assistance to deserving students under the Moovalur Ramamirtham scheme.",
      deadline: "2025-09-05"
    },
    {
      name: "EVR Nagammai Scholarship",
      category: "OBC",
      incomeLimit: 200000,
      minMarks: 65,
      requiredDocs: "Community Certificate, Marksheet",
      explanation: "Scholarship for OBC students excelling in academics.",
      deadline: "2025-07-15"
    },
    {
      name: "National Means-cum-Merit Scholarship (NMMS)",
      category: "General",
      incomeLimit: 150000,
      minMarks: 55,
      requiredDocs: "Income Certificate, Marksheet, Caste Certificate (if applicable)",
      explanation: "Supports meritorious students from economically weaker sections to reduce dropout after class 8.",
      deadline: "2025-11-15"
    },
    {
      name: "Inspire Scholarship for Higher Education (SHE)",
      category: "General",
      incomeLimit: 500000,
      minMarks: 85,
      requiredDocs: "Marksheet, Income Certificate, Aadhar Card",
      explanation: "For students pursuing BSc, BS, and MSc courses in Natural and Basic Sciences.",
      deadline: "2025-10-20"
    },
    {
      name: "Tamil Nadu Free Education Scheme for Girls",
      category: "General",
      incomeLimit: 300000,
      minMarks: 50,
      requiredDocs: "Community Certificate, Marksheet, College ID",
      explanation: "Provides tuition fee waiver for girl students from Tamil Nadu.",
      deadline: "2025-08-10"
    },
    {
      name: "Post Matric Scholarship for Minority Students",
      category: "General",
      incomeLimit: 200000,
      minMarks: 50,
      requiredDocs: "Minority Certificate, Marksheet, Income Certificate",
      explanation: "Supports students belonging to minority communities at post-matric level.",
      deadline: "2025-09-30"
    },
    {
      name: "Pragati Scholarship for Girl Students",
      category: "General",
      incomeLimit: 800000,
      minMarks: 60,
      requiredDocs: "Aadhar Card, Marksheet, Income Certificate",
      explanation: "AICTE scheme for girl students pursuing technical education.",
      deadline: "2025-12-01"
    }
  ];
  
  function displayScholarships(list) {
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = "";
  
    if (list.length === 0) {
      resultDiv.innerHTML = "<p>No matching scholarships found.</p>";
      return;
    }
  
    list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  
    list.forEach(sch => {
      const card = document.createElement('div');
      card.className = 'card';
  
      const deadlineStr = new Date(sch.deadline).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
  
      card.innerHTML = `
        <strong>${sch.name}</strong>
        <span>Required Documents: ${sch.requiredDocs}</span>
        <span><strong>Deadline:</strong> ${deadlineStr}</span>
        <div class="details">
          <p><strong>Explanation:</strong> ${sch.explanation}</p>
        </div>
      `;
  
      card.addEventListener('click', () => {
        card.classList.toggle('active');
      });
  
      resultDiv.appendChild(card);
    });
  }
  
  async function askDeepSeek(promptText) {
    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer sk-88d1c600ad2a4472940e9b268373413d"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are an expert in Indian scholarships and student welfare." },
            { role: "user", content: promptText }
          ]
        })
      });
  
      const data = await response.json();
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      } else {
        console.error("Unexpected response:", data);
        return "DeepSeek did not return a valid response.";
      }
    } catch (error) {
      console.error("DeepSeek API Error:", error);
      return "Something went wrong while contacting DeepSeek AI.";
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    displayScholarships(scholarships);
  });
  
  document.getElementById('scholarshipForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('studentName').value.trim();
    const category = document.getElementById('category').value;
    const income = parseInt(document.getElementById('income').value);
    const marks = parseInt(document.getElementById('marks').value);
    const school = document.getElementById('school').value.trim();
    const district = document.getElementById('district').value.trim();
    const state = document.getElementById('state').value.trim();
  
    if (!category || isNaN(income) || isNaN(marks)) {
      alert("Please complete all fields correctly.");
      return;
    }
  
    if (income < 24000) {
      alert("Minimum annual income must be ₹24,000 or more.");
      return;
    }
  
    const matched = scholarships.filter(sch =>
      sch.category === category &&
      income <= sch.incomeLimit &&
      marks >= sch.minMarks
    );
  
    displayScholarships(matched);
  
    // Loading placeholder
    const resultDiv = document.getElementById('results');
    const loadingCard = document.createElement('div');
    loadingCard.className = 'card';
    loadingCard.innerHTML = `<strong>AI-Powered Suggestions</strong><p>Loading suggestions from DeepSeek AI...</p>`;
    resultDiv.appendChild(loadingCard);
  
    const prompt = `
      Name: ${name}
      Category: ${category}
      Marks: ${marks}%
      Income: ₹${income}
      School: ${school}
      District: ${district}
      State: ${state}
  
      Based on this student's profile, recommend the best scholarships in India.
      Be specific and helpful. Include government and private options if possible.
    `;
  
    const aiResponse = await askDeepSeek(prompt);
  
    loadingCard.innerHTML = `
      <strong>AI-Powered Suggestions</strong>
      <div class="details"><p>${aiResponse}</p></div>
    `;
  });
  