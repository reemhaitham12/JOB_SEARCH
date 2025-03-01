
document.getElementById('downloadButton').addEventListener('click', async () => {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = ''; 
    const companyId = "company-id"; 
    const date = "2025-03-01"; 
  
    try {
      
      const response = await axios.get(`/api/companies/generate-applications-excel?companyId=${companyId}&date=${date}`, {
        responseType: 'blob', 
      });
  
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'applications.xlsx'); 
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      
      errorMessageElement.textContent = "wrong in build excel.";
    }
  });
  