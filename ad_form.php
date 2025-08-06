<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "finalproject";

// If form submitted, save to database
if ($_POST && !isset($_GET['action'])) {
    $conn = new mysqli($host, $username, $password, $database);
    
    // Get form data
    $full_name = $conn->real_escape_string($_POST['name']);
    $company_name = $conn->real_escape_string($_POST['cname']);
    $email = $conn->real_escape_string($_POST['email']);
    $link = $conn->real_escape_string($_POST['link']);
    $image_data = file_get_contents($_FILES['image']['tmp_name']);
    
    $stmt = $conn->prepare("INSERT INTO contacts (Full_Name, Company_Name, Email, Link, Image) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $full_name, $company_name, $email, $link, $image_data);
    $stmt->execute();
    echo "Submission successful!";
    $conn->close();
}

?>