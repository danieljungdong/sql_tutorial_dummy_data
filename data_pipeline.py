# SQL Tutorial for Business Growth
# Copyright © 2021 daniel@lazyenterprise.com
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


import pip
import os
import sys



def install(package):
    if package == 'psycopg2':
        package = 'psycopg2-binary'
    pip.main(['install', package])  


#read the three csv files in local directory and create corresponding tables
def create_table(name, csv, engine):
    try:
        temp = pd.read_csv(csv)
        temp_name = name
        temp.to_sql(temp_name, engine, index = True, if_exists = 'replace', chunksize = 5000)
        sys.stdout.write('{} table is created successfully'.format(temp_name))
		# print('{} table is created successfully'.format(temp_name))
    except:
        print('{} table is not created successfully'.format(name), Exception)

if __name__ == '__main__':
    if int(pip.__version__.split('.')[0])>9:
        import pip._internal as pip
    else:
        import pip
    libraries = ['pandas as pd', 'sqlalchemy as sql', 'psycopg2']
    # exec("")
    for x in libraries:
        try:
            exec("import {}".format(x))
        except ImportError:
            #install package
            install(x)

    path = "./data/"
    dirs = os.listdir(path)
    engine = sql.create_engine(sys.argv[1]) #'postgresql://postgres:1234@localhost:5432'
    for csv_file in dirs:
        if ".csv" in csv_file:
            create_table(csv_file.strip(".csv"), path + csv_file, engine)
        else:
            pass

    # print(dirs)
