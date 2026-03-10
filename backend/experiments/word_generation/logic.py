# word_generation/logic.py

from .data import DATA


def check_transformations(root, user_rows):

    correct = DATA.get(root)

    results = []

    for row in user_rows:

        key = f"{row['number']}_{row['case']}"

        correct_row = correct[key]

        if row["delete"] == correct_row["delete"] and row["add"] == correct_row["add"]:
            results.append(True)
        else:
            results.append(False)

    return results


def get_correct_table(root):

    correct = DATA.get(root)

    table = []

    for key, value in correct.items():

        number, case = key.split("_")

        table.append({
            "delete": value["delete"],
            "add": value["add"],
            "number": number,
            "case": case
        })

    return table