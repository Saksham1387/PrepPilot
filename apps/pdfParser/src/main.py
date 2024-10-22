import json
from pdfminer.high_level import extract_text
import re

# Function to extract PDF data into structured JSON
def parse_pdf_text_to_json(text):
    data = {}

    # Extract contact details
    contact_section = re.search(r'Contact\s+([\s\S]+?)Top Skills', text)
    if contact_section:
        contact_info = contact_section.group(1).strip().splitlines()
        contact_info = list(filter(None, contact_info))
        
        data['contact'] = {
            'phone': contact_info[0],
            'email': contact_info[1],
            'linkedin': contact_info[2]
        }

    # Extract personal information (Name, title, location)
    personal_info = contact_info[3:]  # Remaining info from contact section
    if personal_info:
        data['personal_information'] = {
            'name': personal_info[0],
            'title': personal_info[1],
            'location': personal_info[2]
        }

    # Extract top skills
    skills_section = re.search(r'Top Skills\s+([\s\S]+?)Languages', text)
    if skills_section:
        skills = skills_section.group(1).strip().splitlines()
        data['skills'] = list(filter(None, skills))

    # Extract languages
    languages_section = re.search(r'Languages\s+([\s\S]+?)Certifications', text)
    if languages_section:
        languages = languages_section.group(1).strip().splitlines()
        data['languages'] = list(filter(None, languages))

    # Extract certifications
    certifications_section = re.search(r'Certifications\s+([\s\S]+?)Honors-Awards', text)
    if certifications_section:
        certifications = certifications_section.group(1).strip().splitlines()
        data['certifications'] = list(filter(None, certifications))

    # Extract honors and awards
    honors_section = re.search(r'Honors-Awards\s+([\s\S]+?)Publications', text)
    if honors_section:
        honors = honors_section.group(1).strip().splitlines()
        data['honors_awards'] = list(filter(None, honors))

    # Extract publications
    publications_section = re.search(r'Publications\s+([\s\S]+?)Summary', text)
    if publications_section:
        publications = publications_section.group(1).strip().splitlines()
        data['publications'] = list(filter(None, publications))

    # Extract summary
    summary_section = re.search(r'Summary\s+([\s\S]+?)Experience', text)
    if summary_section:
        summary = summary_section.group(1).strip().replace('\n', ' ')
        data['summary'] = summary

    # Extract experience
    experience_section = re.search(r'Experience\s+([\s\S]+?)Education', text)
    if experience_section:
        experience_lines = experience_section.group(1).strip().splitlines()
        experience_lines = list(filter(None, experience_lines))

        # Parse the experience into structured fields
        experience_data = []
        i = 0
        while i < len(experience_lines):
            # Ensure enough elements exist for company, duration, location
            if i + 3 < len(experience_lines):
                role = experience_lines[i]
                company = experience_lines[i + 1]
                duration = experience_lines[i + 2]
                location = experience_lines[i + 3]
                description = experience_lines[i + 4:i + 6] if i + 4 < len(experience_lines) else []

                experience_data.append({
                    'role': role,
                    'company': company,
                    'duration': duration,
                    'location': location,
                    'description': ' '.join(description)
                })
                i += 7  # Move to the next experience block
            else:
                # If there are not enough lines, break out of the loop
                break

        data['experience'] = experience_data

    # Extract education
    education_section = re.search(r'Education\s+([\s\S]+)$', text)
    if education_section:
        education = education_section.group(1).strip().splitlines()
        data['education'] = list(filter(None, education))

    return data

# Extract text from PDF
text = extract_text("Profile.pdf")

# Parse the extracted text into a JSON format
parsed_data = parse_pdf_text_to_json(text)

# Save the structured data to a JSON file
with open('profile_data.json', 'w') as json_file:
    json.dump(parsed_data, json_file, indent=4)

# Print the JSON data
print(json.dumps(parsed_data, indent=4))