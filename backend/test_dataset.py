import kagglehub
import pandas as pd
import os

path = kagglehub.dataset_download('saurabhshahane/fake-news-classification')
csv_file = os.path.join(path, 'WELFake_Dataset.csv')

df = pd.read_csv(csv_file, nrows=10)
for i, row in df.iterrows():
    print(f"LABEL: {row['label']} - TITLE: {row['title']}")
