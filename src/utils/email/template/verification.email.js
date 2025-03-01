export const verificationEmailTemplate = ({ code } = {}) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Email Card</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .card {
            max-width: 400px;
            margin: auto;
            border-radius: 12px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .emoji {
            font-size: 24px;
        }
    </style>
</head>
<body>

<div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 text-center">
        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Smiley" width="50" class="mx-auto">
        <h5 class="mt-3">Please verify your email <span class="emoji">🥰</span></h5>
        <p class="text-muted">To use Job Search, copy the verification code. This helps keep your account secure.</p>
        <p class="bg-primary text-white fw-bold text-center rounded py-2 fs-4">${code}</p>        
        <p class="mt-3 text-muted small">You're receiving this email because you have an account in Job. If you're not sure why, contact us.</p>
        <div class="bg-light p-3 rounded">
            <p class="small text-muted mb-0">Email specialists use Job Search's intuitive tool to design emails for desktop and mobile.</p>
        </div>
    </div>
</div>

</body>
</html>
`;
};
