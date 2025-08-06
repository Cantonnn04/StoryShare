<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "finalproject";

// Saveing to database
if ($_POST && !isset($_GET['action'])) {
    $conn = new mysqli($host, $username, $password, $database);
    
    // Insert into submissions table
    $conn->query("INSERT INTO submissions () VALUES ()");
    $id = $conn->insert_id;
    
    // Insert into stories table
    $stmt = $conn->prepare("INSERT INTO stories (id, anonymous_name, title, body) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $id, $_POST['name'], $_POST['title'], $_POST['body']);
    $stmt->execute();
    
    $conn->close();
}

// Getting stories from database
if (isset($_GET['action']) && $_GET['action'] == 'get_stories') {
    $conn = new mysqli($host, $username, $password, $database);
    
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    $limit = 3; // Show 3 stories at a time as I did not want the database to be overwhelmed so I set a limit of 3 stories
    
    // Sorting the stories so the most recent ones are first (ORDER BY sub.submitted_at DESC)
    $query = "SELECT s.title, s.body, s.anonymous_name, sub.submitted_at 
              FROM stories s 
              JOIN submissions sub ON s.id = sub.id 
              ORDER BY sub.submitted_at DESC 
              LIMIT ? OFFSET ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $stories = [];
    while ($row = $result->fetch_assoc()) {
        $stories[] = $row;
    }
    
    $countQuery = "SELECT COUNT(*) as total FROM stories";
    $countResult = $conn->query($countQuery);
    $totalStories = $countResult->fetch_assoc()['total'];
    $hasMore = ($offset + $limit) < $totalStories;
    
    $conn->close();
    
    header('Content-Type: application/json');
    echo json_encode([
        'stories' => $stories,
        'hasMore' => $hasMore
    ]);
    exit;
}
?>