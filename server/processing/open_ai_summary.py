import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def summarize_stats(stats):
    openai = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    
    prompt = f"""
    Generate a brief but insightful summary of the following hockey game statistics:
    
    Left Side Time: {stats.get('left_side_time', 'N/A')} seconds
    Right Side Time: {stats.get('right_side_time', 'N/A')} seconds
    Left Side Percentage: {stats.get('left_side_percentage', 'N/A')}%
    Right Side Percentage: {stats.get('right_side_percentage', 'N/A')}%
    
    Please highlight which side dominated possession, significant time disparities,
    and any tactical insights that can be derived from this zone control data.
    Keep the summary concise and focused on actionable insights.
    """
    
    try:
        response = openai.chat.completions.create(
            model="gpt-4-turbo", 
            messages=[
                {"role": "system", "content": "You are an expert hockey analyst providing insights on game data. Please summarize the statistics and provide insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating summary: {str(e)}"
