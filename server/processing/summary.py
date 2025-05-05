import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def summarize_stats(stats):
    
    openai = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    prompt = get_summary_prompt(stats)
    
    try:
        response = openai.chat.completions.create(
            model="gpt-4-turbo", 
            messages=[
                {"role": "system", "content": "You are an expert hockey analyst providing insights on game data. Please summarize the statistics and provide insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating summary: {str(e)}"

def get_summary_prompt(stats):
    return f"""
    Generate a brief but insightful summary of the following hockey game statistics with three zones:
    
    Left Side Time: {stats.get('left_side_time', 'N/A')} seconds
    Middle Zone Time: {stats.get('middle_zone_time', 'N/A')} seconds
    Right Side Time: {stats.get('right_side_time', 'N/A')} seconds
    
    Left Side Percentage: {stats.get('left_side_percentage', 'N/A')}%
    Middle Zone Percentage: {stats.get('middle_zone_percentage', 'N/A')}%
    Right Side Percentage: {stats.get('right_side_percentage', 'N/A')}%
    
    Please highlight zone control patterns, which zone(s) dominated possession, significant time disparities,
    and tactical insights that can be derived from this three-zone data (offensive, neutral, and defensive zones).
    Pay special attention to neutral zone (middle) control and its implications for transitions.
    Keep the summary concise and focused on actionable insights. This is just general about a game; it is about two teams, the team names are not known so just talk about them abstractly.
    """