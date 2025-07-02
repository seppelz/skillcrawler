#!/usr/bin/env python3
"""
Script to seed the database with 10 well-researched skills and learning paths
with comprehensive videos and detailed content.
"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base, Skill, LearningPath, LearningPathVideo, Video, User, UserProgress
import os
from dotenv import load_dotenv
from datetime import datetime
from sqlalchemy.exc import IntegrityError

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///test.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dictionary of skills with descriptions
SKILLS_DATA = {
    "Data Science": "The interdisciplinary field combining statistical methods, algorithms, and systems to extract knowledge and insights from structured and unstructured data.",
    "Web Development": "The work involved in creating websites and web applications for the internet or intranet.",
    "Machine Learning": "The scientific study of algorithms and statistical models that computer systems use to perform tasks without explicit instructions.",
    "User Experience Design": "The process of creating products that provide meaningful and relevant experiences to users.",
    "Digital Marketing": "The component of marketing that uses the internet and online technologies to deliver promotional marketing messages.",
    "Project Management": "The practice of initiating, planning, executing, controlling, and closing the work of a team to achieve specific goals.",
    "Cloud Computing": "The delivery of computing services—including servers, storage, databases, networking, software—over the internet.",
    "Cybersecurity": "The practice of protecting systems, networks, and programs from digital attacks.",
    "Data Visualization": "The graphic representation of data to interactively and efficiently convey insights to consumers of the information.",
    "DevOps": "A set of practices that combines software development and IT operations to shorten the systems development life cycle."
}

def clear_database():
    """Clear all data from the database tables in correct order to avoid constraint violations."""
    db = SessionLocal()
    try:
        print("Clearing existing data from database...")
        # Delete in reverse order of dependencies
        db.execute(text("DELETE FROM user_progress"))
        db.execute(text("DELETE FROM learning_path_videos"))
        db.execute(text("DELETE FROM videos"))
        db.execute(text("DELETE FROM learning_paths"))
        db.execute(text("DELETE FROM skills"))
        # Don't delete users as we might want to keep them
        db.commit()
        print("Database cleared successfully")
    except Exception as e:
        print(f"Error clearing database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def seed_database():
    # First clear the database
    clear_database()
    
    db = SessionLocal()
    try:
        print("Seeding database with 10 comprehensive skills and learning paths...")
        
        # Create a test user if it doesn't exist
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                email="test@example.com",
                password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # password = "password"
                name="Test User"
            )
            db.add(test_user)
            db.commit()
            print("Created test user: test@example.com with password 'password'")
        
        # Create skills
        skills = {}
        for skill_name, description in SKILLS_DATA.items():
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(name=skill_name, description=description)
                db.add(skill)
                print(f"Created skill: {skill_name}")
            skills[skill_name] = skill
        
        # Commit skills to get their IDs
        db.commit()
        
        # Learning paths and video content for each skill
        # Each skill will have 1-2 learning paths with 3-5 videos each
        
        # 1. DATA SCIENCE
        data_science_videos = [
            Video(
                youtube_id="ua-CiDNNj30",
                title="What is Data Science? | Intro to Data Science",
                description="A comprehensive overview of data science, its applications, and career paths.",
                duration_seconds=1451,  # 24:11
                quality_score="high",
                skill_id=skills["Data Science"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="N6BghzuFLIg",
                title="Statistics for Data Science | Probability and Statistics",
                description="Learn essential statistical concepts for data science applications.",
                duration_seconds=3952,  # 1:05:52
                quality_score="high",
                skill_id=skills["Data Science"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="QoVGNbHpkLE",
                title="Python for Data Science - Course for Beginners",
                description="Learn Python programming skills specific to data analysis and science.",
                duration_seconds=12057,  # 3:20:57
                quality_score="high",
                skill_id=skills["Data Science"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="zv7B5AMUcuE",
                title="Machine Learning for Data Science Using Python",
                description="Introduction to ML algorithms and implementations using Python for data analysis.",
                duration_seconds=4965,  # 1:22:45
                quality_score="high",
                skill_id=skills["Data Science"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="GPVsHOlRBBI",
                title="Data Science Project - End to End Pipeline",
                description="Complete walkthrough of a data science project from data collection to deployment.",
                duration_seconds=8337,  # 2:18:57
                quality_score="high",
                skill_id=skills["Data Science"].id,
                difficulty="advanced"
            )
        ]
        
        # 2. WEB DEVELOPMENT
        web_dev_videos = [
            Video(
                youtube_id="cyuzt1Dp8X8",
                title="HTML & CSS Crash Course",
                description="Quick introduction to HTML and CSS for building websites.",
                duration_seconds=6026,  # 1:40:26
                quality_score="high",
                skill_id=skills["Web Development"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="W6NZfCO5SIk",
                title="JavaScript Fundamentals",
                description="Core concepts of JavaScript programming language for web development.",
                duration_seconds=2837,  # 47:17
                quality_score="high",
                skill_id=skills["Web Development"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="7CqJlxBYj-M",
                title="React.js Full Course for Beginners",
                description="Learn React.js from scratch including hooks, state management, and components.",
                duration_seconds=7082,  # 1:57:62
                quality_score="high",
                skill_id=skills["Web Development"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="vm3YzNTlhjc",
                title="Build a Full-Stack App with Node.js & Express",
                description="Create a complete backend system using Node.js and Express framework.",
                duration_seconds=6680,  # 1:51:20
                quality_score="high",
                skill_id=skills["Web Development"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="B_w6Z7uTMbA",
                title="Responsive Web Design Best Practices",
                description="Learn techniques for creating responsive websites that work on all devices.",
                duration_seconds=2468,  # 41:08
                quality_score="high",
                skill_id=skills["Web Development"].id,
                difficulty="intermediate"
            )
        ]
        
        # 3. MACHINE LEARNING
        ml_videos = [
            Video(
                youtube_id="NWONeJKn6kc",
                title="Machine Learning Explained",
                description="Introduction to core machine learning concepts and terminology.",
                duration_seconds=1739,  # 28:59
                quality_score="high",
                skill_id=skills["Machine Learning"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="gmvvaobm7eQ",
                title="Linear Regression - Machine Learning from Scratch",
                description="Detailed explanation of linear regression algorithm with implementation.",
                duration_seconds=2053,  # 34:13
                quality_score="high",
                skill_id=skills["Machine Learning"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="pLOk7jN6wBo",
                title="Neural Networks Fundamentals",
                description="How neural networks work and their applications in machine learning.",
                duration_seconds=3127,  # 52:07
                quality_score="high",
                skill_id=skills["Machine Learning"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="Gv9_4yMHFhI",
                title="Deep Learning with TensorFlow",
                description="Practical deep learning implementation using TensorFlow framework.",
                duration_seconds=6154,  # 1:42:34
                quality_score="high",
                skill_id=skills["Machine Learning"].id,
                difficulty="advanced"
            ),
            Video(
                youtube_id="BqgTU7_cBnk",
                title="Machine Learning for Computer Vision",
                description="Applications of ML for image recognition and computer vision tasks.",
                duration_seconds=3569,  # 59:29
                quality_score="high",
                skill_id=skills["Machine Learning"].id,
                difficulty="advanced"
            )
        ]
        
        # 4. UX DESIGN
        ux_videos = [
            Video(
                youtube_id="5CxXhyhT6Fc",
                title="Introduction to UX Design",
                description="Overview of user experience design principles and methodology.",
                duration_seconds=1825,  # 30:25
                quality_score="high",
                skill_id=skills["User Experience Design"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="_lyzy-vChh4",
                title="User Research Techniques",
                description="Methods for gathering user insights and conducting effective UX research.",
                duration_seconds=1986,  # 33:06
                quality_score="high",
                skill_id=skills["User Experience Design"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="c9Wg-Gutd_o",
                title="Prototyping and Wireframing",
                description="Learn to create effective wireframes and interactive prototypes.",
                duration_seconds=2384,  # 39:44
                quality_score="high",
                skill_id=skills["User Experience Design"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="YiLUYf4HDh4",
                title="Usability Testing Fundamentals",
                description="How to plan and conduct usability tests to improve product design.",
                duration_seconds=2782,  # 46:22
                quality_score="high",
                skill_id=skills["User Experience Design"].id,
                difficulty="intermediate"
            )
        ]
        
        # 5. DIGITAL MARKETING
        marketing_videos = [
            Video(
                youtube_id="bD1kssrN4iM",
                title="Digital Marketing Course Overview",
                description="Introduction to digital marketing channels and strategies.",
                duration_seconds=3145,  # 52:25
                quality_score="high",
                skill_id=skills["Digital Marketing"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="tB3_6hZxpFE",
                title="Search Engine Optimization (SEO) Fundamentals",
                description="Learn how to optimize websites for better search engine rankings.",
                duration_seconds=4221,  # 1:10:21
                quality_score="high",
                skill_id=skills["Digital Marketing"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="a3KCBp3_9vI",
                title="Social Media Marketing Strategies",
                description="Effective tactics for marketing on various social media platforms.",
                duration_seconds=3267,  # 54:27
                quality_score="high",
                skill_id=skills["Digital Marketing"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="Qhaz36TZG5Y",
                title="Email Marketing Mastery",
                description="Best practices for creating effective email marketing campaigns.",
                duration_seconds=2849,  # 47:29
                quality_score="high",
                skill_id=skills["Digital Marketing"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="9cKsq14Kfsw",
                title="Analytics and Data-Driven Marketing",
                description="Using data analytics to improve marketing performance and ROI.",
                duration_seconds=3593,  # 59:53
                quality_score="high",
                skill_id=skills["Digital Marketing"].id,
                difficulty="advanced"
            )
        ]
        
        # 6. PROJECT MANAGEMENT
        pm_videos = [
            Video(
                youtube_id="oFFjmKP6UJ8",
                title="Project Management Fundamentals",
                description="Introduction to project management principles and methodologies.",
                duration_seconds=2356,  # 39:16
                quality_score="high",
                skill_id=skills["Project Management"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="LFkGjlFgQB8",
                title="Agile Project Management",
                description="Overview of Agile methodology and its application in project management.",
                duration_seconds=3482,  # 58:02
                quality_score="high",
                skill_id=skills["Project Management"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="TiZej3sV3Gw",
                title="Project Planning and Scheduling",
                description="Techniques for effective project planning, scheduling, and resource allocation.",
                duration_seconds=2731,  # 45:31
                quality_score="high",
                skill_id=skills["Project Management"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="M44M7SgfwTs",
                title="Risk Management in Projects",
                description="How to identify, analyze, and mitigate risks in project management.",
                duration_seconds=1965,  # 32:45
                quality_score="high",
                skill_id=skills["Project Management"].id,
                difficulty="advanced"
            )
        ]
        
        # 7. CLOUD COMPUTING
        cloud_videos = [
            Video(
                youtube_id="M988_fsOSWo",
                title="Cloud Computing Explained",
                description="Introduction to cloud computing concepts, models, and services.",
                duration_seconds=2156,  # 35:56
                quality_score="high",
                skill_id=skills["Cloud Computing"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="ulprqHHWlng",
                title="AWS Basics for Beginners",
                description="Getting started with Amazon Web Services cloud platform.",
                duration_seconds=6348,  # 1:45:48
                quality_score="high",
                skill_id=skills["Cloud Computing"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="JtV5VXp1-Rw",
                title="Google Cloud Platform Fundamentals",
                description="Core services and features of Google Cloud Platform.",
                duration_seconds=4267,  # 1:11:07
                quality_score="high",
                skill_id=skills["Cloud Computing"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="Xe9hQmVJHAo",
                title="Cloud Security Best Practices",
                description="Security considerations and best practices for cloud environments.",
                duration_seconds=3219,  # 53:39
                quality_score="high",
                skill_id=skills["Cloud Computing"].id,
                difficulty="advanced"
            )
        ]
        
        # 8. CYBERSECURITY
        security_videos = [
            Video(
                youtube_id="inWWhr5tnEA",
                title="Cybersecurity Fundamentals",
                description="Introduction to key cybersecurity concepts and terminology.",
                duration_seconds=4631,  # 1:17:11
                quality_score="high",
                skill_id=skills["Cybersecurity"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="qiQR5rTSshw",
                title="Network Security Basics",
                description="Core principles and practices for securing computer networks.",
                duration_seconds=5641,  # 1:34:01
                quality_score="high",
                skill_id=skills["Cybersecurity"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="3FNYvj2U0HM",
                title="Ethical Hacking for Beginners",
                description="Introduction to ethical hacking methodologies and tools.",
                duration_seconds=11674,  # 3:14:34
                quality_score="high",
                skill_id=skills["Cybersecurity"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="KvPBGQ_GqqU",
                title="Cybersecurity Risk Assessment",
                description="Methods for identifying and evaluating security risks in organizations.",
                duration_seconds=2965,  # 49:25
                quality_score="high",
                skill_id=skills["Cybersecurity"].id,
                difficulty="advanced"
            ),
            Video(
                youtube_id="GzYgPmqQKzA",
                title="Security Incident Response Planning",
                description="How to create and implement effective security incident response plans.",
                duration_seconds=3150,  # 52:30
                quality_score="high",
                skill_id=skills["Cybersecurity"].id,
                difficulty="advanced"
            )
        ]
        
        # 9. DATA VISUALIZATION
        dataviz_videos = [
            Video(
                youtube_id="N99Eqy1OiSc",
                title="Introduction to Data Visualization",
                description="Core principles and best practices in data visualization.",
                duration_seconds=2578,  # 42:58
                quality_score="high",
                skill_id=skills["Data Visualization"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="QXqegFWFR9g",
                title="Data Visualization with Python",
                description="Creating effective visualizations using Python libraries.",
                duration_seconds=5683,  # 1:34:43
                quality_score="high",
                skill_id=skills["Data Visualization"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="E1lDwXQz8yE",
                title="Tableau for Data Visualization",
                description="Using Tableau software to create interactive data visualizations.",
                duration_seconds=4238,  # 1:10:38
                quality_score="high",
                skill_id=skills["Data Visualization"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="WkIJqoLF-XQ",
                title="Advanced Chart Types and When to Use Them",
                description="Guide to selecting appropriate chart types for different data scenarios.",
                duration_seconds=1986,  # 33:06
                quality_score="high",
                skill_id=skills["Data Visualization"].id,
                difficulty="advanced"
            )
        ]
        
        # 10. DEVOPS
        devops_videos = [
            Video(
                youtube_id="_I94-tJlovg",
                title="DevOps Explained",
                description="Introduction to DevOps culture, practices, and tools.",
                duration_seconds=2461,  # 41:01
                quality_score="high",
                skill_id=skills["DevOps"].id,
                difficulty="beginner"
            ),
            Video(
                youtube_id="j5Zsa_eOXeY",
                title="Continuous Integration and Deployment (CI/CD)",
                description="Building effective CI/CD pipelines for software delivery.",
                duration_seconds=3592,  # 59:52
                quality_score="high",
                skill_id=skills["DevOps"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="PwWHL3RyQgk",
                title="Docker and Containerization",
                description="Using Docker containers for application deployment and scaling.",
                duration_seconds=4851,  # 1:20:51
                quality_score="high",
                skill_id=skills["DevOps"].id,
                difficulty="intermediate"
            ),
            Video(
                youtube_id="CwBiLTilQ5s",
                title="Infrastructure as Code with Terraform",
                description="Managing infrastructure using code with Terraform.",
                duration_seconds=4521,  # 1:15:21
                quality_score="high",
                skill_id=skills["DevOps"].id,
                difficulty="advanced"
            ),
            Video(
                youtube_id="GOxy7vTbVuI",
                title="Kubernetes for Container Orchestration",
                description="Managing containerized applications at scale with Kubernetes.",
                duration_seconds=5874,  # 1:37:54
                quality_score="high",
                skill_id=skills["DevOps"].id,
                difficulty="advanced"
            )
        ]
        # Add all videos to the database
        all_videos = (
            data_science_videos + web_dev_videos + ml_videos + ux_videos + 
            marketing_videos + pm_videos + cloud_videos + security_videos + 
            dataviz_videos + devops_videos
        )
        
        for video in all_videos:
            db.add(video)
        
        db.commit()
        print(f"Added {len(all_videos)} videos across 10 skills")
        
        # Create learning paths for each skill
        learning_paths = [
            # Data Science paths
            LearningPath(
                name="Data Science Fundamentals",
                description="A beginner-friendly introduction to the field of data science covering key concepts and tools.",
                skill_id=skills["Data Science"].id,
                created_by=test_user.id
            ),
            LearningPath(
                name="Advanced Data Science Techniques",
                description="Deep dive into advanced data science methodologies and machine learning applications.",
                skill_id=skills["Data Science"].id,
                created_by=test_user.id
            ),
            
            # Web Development paths
            LearningPath(
                name="Front-End Web Development",
                description="Master HTML, CSS, and JavaScript to build interactive and responsive websites.",
                skill_id=skills["Web Development"].id,
                created_by=test_user.id
            ),
            LearningPath(
                name="Full-Stack JavaScript Development",
                description="Build complete web applications using modern JavaScript frameworks for both frontend and backend.",
                skill_id=skills["Web Development"].id,
                created_by=test_user.id
            ),
            
            # Machine Learning paths
            LearningPath(
                name="Machine Learning Foundations",
                description="Introduction to core machine learning concepts, algorithms, and applications.",
                skill_id=skills["Machine Learning"].id,
                created_by=test_user.id
            ),
            LearningPath(
                name="Deep Learning Specialization",
                description="Advanced techniques in neural networks, deep learning architectures, and real-world applications.",
                skill_id=skills["Machine Learning"].id,
                created_by=test_user.id
            ),
            
            # UX Design paths
            LearningPath(
                name="UX Design Principles",
                description="Learn fundamental UX design concepts and user research methodologies.",
                skill_id=skills["User Experience Design"].id,
                created_by=test_user.id
            ),
            
            # Digital Marketing paths
            LearningPath(
                name="Digital Marketing Essentials",
                description="Comprehensive introduction to various digital marketing channels and strategies.",
                skill_id=skills["Digital Marketing"].id,
                created_by=test_user.id
            ),
            LearningPath(
                name="Advanced Marketing Analytics",
                description="Data-driven approaches to optimizing marketing campaigns and measuring ROI.",
                skill_id=skills["Digital Marketing"].id,
                created_by=test_user.id
            ),
            
            # Project Management paths
            LearningPath(
                name="Project Management Essentials",
                description="Core project management concepts, methodologies, and best practices.",
                skill_id=skills["Project Management"].id,
                created_by=test_user.id
            ),
            
            # Cloud Computing paths
            LearningPath(
                name="Cloud Computing Fundamentals",
                description="Introduction to cloud platforms, services, and deployment models.",
                skill_id=skills["Cloud Computing"].id,
                created_by=test_user.id
            ),
            
            # Cybersecurity paths
            LearningPath(
                name="Cybersecurity Basics",
                description="Essential security concepts and best practices for protecting digital assets.",
                skill_id=skills["Cybersecurity"].id,
                created_by=test_user.id
            ),
            LearningPath(
                name="Ethical Hacking and Penetration Testing",
                description="Advanced security assessment techniques and ethical hacking methodologies.",
                skill_id=skills["Cybersecurity"].id,
                created_by=test_user.id
            ),
            
            # Data Visualization paths
            LearningPath(
                name="Data Visualization Techniques",
                description="Methods and tools for effective data visualization and storytelling.",
                skill_id=skills["Data Visualization"].id,
                created_by=test_user.id
            ),
            
            # DevOps paths
            LearningPath(
                name="DevOps Engineering",
                description="Principles and practices of DevOps for streamlined software delivery.",
                skill_id=skills["DevOps"].id,
                created_by=test_user.id
            ),
        ]
        
        # Add learning paths to database
        for path in learning_paths:
            db.add(path)
        
        db.commit()
        print(f"Added {len(learning_paths)} learning paths across 10 skills")
        
        # Associate videos with learning paths
        # Get all learning paths by name for association
        paths_by_name = {path.name: path for path in db.query(LearningPath).all()}
        
        # Data Science path associations
        path_video_associations = [
            # Data Science Fundamentals path
            LearningPathVideo(
                learning_path_id=paths_by_name["Data Science Fundamentals"].id,
                video_id=data_science_videos[0].id,  # Intro to Data Science
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Data Science Fundamentals"].id,
                video_id=data_science_videos[2].id,  # Python for Data Science
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Data Science Fundamentals"].id,
                video_id=data_science_videos[1].id,  # Statistics for Data Science
                order=3
            ),
            
            # Advanced Data Science path
            LearningPathVideo(
                learning_path_id=paths_by_name["Advanced Data Science Techniques"].id,
                video_id=data_science_videos[3].id,  # ML for Data Science
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Advanced Data Science Techniques"].id,
                video_id=data_science_videos[4].id,  # End to End Pipeline
                order=2
            ),
            
            # Front-End Web Development
            LearningPathVideo(
                learning_path_id=paths_by_name["Front-End Web Development"].id,
                video_id=web_dev_videos[0].id,  # HTML & CSS
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Front-End Web Development"].id,
                video_id=web_dev_videos[1].id,  # JavaScript
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Front-End Web Development"].id,
                video_id=web_dev_videos[4].id,  # Responsive Design
                order=3
            ),
            
            # Full-Stack JavaScript Development
            LearningPathVideo(
                learning_path_id=paths_by_name["Full-Stack JavaScript Development"].id,
                video_id=web_dev_videos[1].id,  # JavaScript
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Full-Stack JavaScript Development"].id,
                video_id=web_dev_videos[2].id,  # React.js
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Full-Stack JavaScript Development"].id,
                video_id=web_dev_videos[3].id,  # Node.js & Express
                order=3
            ),
            
            # Machine Learning Foundations
            LearningPathVideo(
                learning_path_id=paths_by_name["Machine Learning Foundations"].id,
                video_id=ml_videos[0].id,  # ML Explained
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Machine Learning Foundations"].id,
                video_id=ml_videos[1].id,  # Linear Regression
                order=2
            ),
            
            # Deep Learning Specialization
            LearningPathVideo(
                learning_path_id=paths_by_name["Deep Learning Specialization"].id,
                video_id=ml_videos[2].id,  # Neural Networks
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Deep Learning Specialization"].id,
                video_id=ml_videos[3].id,  # TensorFlow
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Deep Learning Specialization"].id,
                video_id=ml_videos[4].id,  # Computer Vision
                order=3
            ),
            
            # UX Design Principles
            LearningPathVideo(
                learning_path_id=paths_by_name["UX Design Principles"].id,
                video_id=ux_videos[0].id,  # Intro to UX
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["UX Design Principles"].id,
                video_id=ux_videos[1].id,  # User Research
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["UX Design Principles"].id,
                video_id=ux_videos[2].id,  # Prototyping
                order=3
            ),
            
            # Digital Marketing Essentials
            LearningPathVideo(
                learning_path_id=paths_by_name["Digital Marketing Essentials"].id,
                video_id=marketing_videos[0].id,  # Overview
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Digital Marketing Essentials"].id,
                video_id=marketing_videos[1].id,  # SEO
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Digital Marketing Essentials"].id,
                video_id=marketing_videos[2].id,  # Social Media
                order=3
            ),
            
            # Advanced Marketing Analytics
            LearningPathVideo(
                learning_path_id=paths_by_name["Advanced Marketing Analytics"].id,
                video_id=marketing_videos[3].id,  # Email Marketing
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Advanced Marketing Analytics"].id,
                video_id=marketing_videos[4].id,  # Analytics
                order=2
            ),
            
            # Project Management Essentials
            LearningPathVideo(
                learning_path_id=paths_by_name["Project Management Essentials"].id,
                video_id=pm_videos[0].id,  # Fundamentals
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Project Management Essentials"].id,
                video_id=pm_videos[1].id,  # Agile
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Project Management Essentials"].id,
                video_id=pm_videos[2].id,  # Planning
                order=3
            ),
            
            # Cloud Computing Fundamentals
            LearningPathVideo(
                learning_path_id=paths_by_name["Cloud Computing Fundamentals"].id,
                video_id=cloud_videos[0].id,  # Explained
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Cloud Computing Fundamentals"].id,
                video_id=cloud_videos[1].id,  # AWS
                order=2
            ),
            
            # Cybersecurity Basics
            LearningPathVideo(
                learning_path_id=paths_by_name["Cybersecurity Basics"].id,
                video_id=security_videos[0].id,  # Fundamentals
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Cybersecurity Basics"].id,
                video_id=security_videos[1].id,  # Network Security
                order=2
            ),
            
            # Ethical Hacking and Penetration Testing
            LearningPathVideo(
                learning_path_id=paths_by_name["Ethical Hacking and Penetration Testing"].id,
                video_id=security_videos[2].id,  # Ethical Hacking
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Ethical Hacking and Penetration Testing"].id,
                video_id=security_videos[3].id,  # Risk Assessment
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Ethical Hacking and Penetration Testing"].id,
                video_id=security_videos[4].id,  # Incident Response
                order=3
            ),
            
            # Data Visualization Techniques
            LearningPathVideo(
                learning_path_id=paths_by_name["Data Visualization Techniques"].id,
                video_id=dataviz_videos[0].id,  # Introduction
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Data Visualization Techniques"].id,
                video_id=dataviz_videos[1].id,  # Python
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["Data Visualization Techniques"].id,
                video_id=dataviz_videos[2].id,  # Tableau
                order=3
            ),
            
            # DevOps Engineering
            LearningPathVideo(
                learning_path_id=paths_by_name["DevOps Engineering"].id,
                video_id=devops_videos[0].id,  # Explained
                order=1
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["DevOps Engineering"].id,
                video_id=devops_videos[1].id,  # CI/CD
                order=2
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["DevOps Engineering"].id,
                video_id=devops_videos[2].id,  # Docker
                order=3
            ),
            LearningPathVideo(
                learning_path_id=paths_by_name["DevOps Engineering"].id,
                video_id=devops_videos[3].id,  # Terraform
                order=4
            )
        ]
        
        # Add all path-video associations
        for assoc in path_video_associations:
            db.add(assoc)
        
        db.commit()
        print(f"Added {len(path_video_associations)} video associations to learning paths")
        
        print("Database successfully seeded with 10 skills, learning paths, and videos!")
        print("You can now login with test@example.com and password 'password'")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    seed_database()
    print("Seed script completed successfully!")
