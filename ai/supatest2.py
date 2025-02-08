from config import supabase


response = (
    supabase
    .table("found_items")
    .select("*")
    .cs("keywords", ["cell phone"])
    .execute()
)



print(response.data)